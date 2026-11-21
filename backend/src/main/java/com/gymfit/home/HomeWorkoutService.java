package com.gymfit.home;

import com.gymfit.home.HomeDtos.*;
import com.gymfit.home.HomeEntities.*;
import com.gymfit.exception.DietException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import java.time.*;
import java.util.*;

@Service @Transactional
public class HomeWorkoutService {
 public static final Set<String> EQUIPMENT=Set.of("YOGA_MAT","DUMBBELLS","RESISTANCE_BANDS","PULL_UP_BAR","KETTLEBELL","JUMP_ROPE","BENCH");
 public static final Set<String> MUSCLES=Set.of("CHEST","BACK","SHOULDERS","BICEPS","TRICEPS","ABS","GLUTES","QUADRICEPS","HAMSTRINGS","CALVES");
 public static final Set<String> LIMITS=Set.of("WRIST","KNEE","SHOULDER","BACK","BALANCE","JUMPING","OVERHEAD","FLOOR","HIP","ANKLE","ELBOW");
 private final HomeRepositories.Profiles profiles;private final HomeRepositories.Plans plans;private final HomeRepositories.Days days;
 private final HomeRepositories.Sessions sessions;private final ExerciseCatalogService catalog;private final HomeJson json;private final Clock clock;private final WorkoutPlanGenerator generator;
 public HomeWorkoutService(HomeRepositories.Profiles profiles,HomeRepositories.Plans plans,HomeRepositories.Days days,HomeRepositories.Sessions sessions,ExerciseCatalogService catalog,HomeJson json,Clock clock,WorkoutPlanGenerator generator){this.profiles=profiles;this.plans=plans;this.days=days;this.sessions=sessions;this.catalog=catalog;this.json=json;this.clock=clock;this.generator=generator;}
 public Profile profile(String owner){return json.read(profiles.findByUserId(owner).orElseThrow(()->DietException.missing("Complete your home-workout profile first.")).profileJson,Profile.class);}
 public Profile saveProfile(String owner,Profile p){
  if(ExerciseCatalogService.rank(p.level())<0||!Set.of("WEIGHT_LOSS","MUSCLE_GAIN","STRENGTH","FITNESS","ENDURANCE","MOBILITY","CORE","MAINTAIN").contains(p.goal())||!Set.of(10,15,20,30,45,60).contains(p.durationMinutes())||!EQUIPMENT.containsAll(p.equipment())||!MUSCLES.containsAll(p.focusMuscles())||!LIMITS.containsAll(p.limitations())||p.injuryNotes()==null||!p.preferredTime().matches("(?:[01][0-9]|2[0-3]):[0-5][0-9]"))throw DietException.invalid("Check fitness level, goal, time, duration, equipment and restriction selections.");
  p.discomfortExercises().forEach(catalog::get);
  var entity=profiles.findByUserId(owner).orElseGet(ProfileEntity::new);entity.userId=owner;entity.profileJson=json.write(p);entity.updatedAt=clock.instant();profiles.saveAndFlush(entity);return p;
 }
 public PlanEntity owned(String owner,long id){return plans.findByIdAndUserId(id,owner).orElseThrow(()->DietException.missing("Workout plan not found."));}
 public PlanView current(String owner){return view(plans.findFirstByUserIdOrderByCreatedAtDesc(owner).orElseThrow(()->DietException.missing("Generate your first home workout plan.")));}
 public PlanView get(String owner,long id){return view(owned(owner,id));}
 public PlanView generate(String owner,Generate request){
  Profile profile=profile(owner);LocalDate today=LocalDate.now(clock);
  if(request.startDate().isBefore(today)||request.startDate().isAfter(today.plusDays(60)))throw DietException.invalid("Choose a start date from today through the next 60 days.");
  var history=sessions.findByUserIdAndStatusInOrderByStartedAtDesc(owner,List.of("COMPLETED"));Set<String> recent=new HashSet<>();
  history.stream().filter(s->s.sessionDate.equals(request.startDate().minusDays(1))).forEach(s->json.list(s.setsJson,SetLog.class).forEach(log->recent.addAll(WorkoutPlanGenerator.muscles(catalog.get(log.exerciseId())))));
  boolean progress=request.progressVolume()&&history.size()>=3&&history.stream().limit(3).noneMatch(s->s.painReported)&&history.stream().limit(3).allMatch(s->json.list(s.setsJson,SetLog.class).size()>=json.list(s.exercisesJson,Prescription.class).stream().mapToInt(Prescription::sets).sum());
  var drafts=generator.generate(profile,request.startDate(),request.quickProgram(),catalog.all(),recent,progress);
  var notices=new ArrayList<String>();notices.add("Keep 2–3 repetitions in reserve and stop for pain. Change only one training variable at a time.");
  if(!profile.equipment().contains("DUMBBELLS")&&!profile.equipment().contains("RESISTANCE_BANDS")&&!profile.equipment().contains("PULL_UP_BAR"))notices.add("No loaded pulling equipment: prone scapular work supports control but does not replace rows or pull-ups for back strength. Consider a suitable band or dumbbells; avoid improvised door or table anchors.");
  notices.add(progress?"At your request, one repetition was added after three fully logged, pain-free workouts; exercise difficulty is unchanged.":"Volume is based on your level. Progression requires an explicit request and three fully logged, pain-free workouts.");
  notices.add("Estimated calories use broad activity MET values, not a measurement. Your diet targets are unchanged; avoid adding these calories to an activity-adjusted TDEE.");
  var plan=new PlanEntity();plan.userId=owner;plan.startDate=request.startDate();plan.createdAt=clock.instant();plan.updatedAt=clock.instant();plan.profileJson=json.write(profile);plan.noticesJson=json.write(notices);plans.saveAndFlush(plan);
  for(var d:drafts){var row=new DayEntity();row.planId=plan.id;row.scheduledDate=d.date();row.title=d.title();row.kind=d.kind();row.exercisesJson=json.write(d.exercises());row.estimatedMinutes=d.minutes();days.save(row);}days.flush();return view(plan);
 }
 public PlanView view(PlanEntity p){var completed=sessions.findByUserIdAndStatusInOrderByStartedAtDesc(p.userId,List.of("COMPLETED")).stream().map(s->s.dayId).collect(java.util.stream.Collectors.toSet());
  return new PlanView(p.id,p.version,p.createdAt,json.read(p.profileJson,Profile.class),json.list(p.noticesJson,String.class),days.findByPlanIdOrderByScheduledDate(p.id).stream().map(d->new DayView(d.id,d.scheduledDate,d.title,d.kind,d.estimatedMinutes,json.list(d.exercisesJson,Prescription.class),completed.contains(d.id))).toList());}
 public PlanView edit(String owner,long id,PlanEdit edit){
  profiles.lockOwner(owner).orElseThrow(()->DietException.missing("Complete your home-workout profile first."));
  var plan=owned(owner,id);if(plan.version!=edit.version())throw new DietException(HttpStatus.CONFLICT,"STALE_PLAN","Reload the changed plan.");
  var list=days.findByPlanIdOrderByScheduledDate(id);var day=list.stream().filter(d->d.id.equals(edit.dayId())).findFirst().orElseThrow(()->DietException.missing("Workout day not found."));checkEditable(owner,day);
  if(edit.swapDayId()!=null){var other=list.stream().filter(d->d.id.equals(edit.swapDayId())).findFirst().orElseThrow(()->DietException.missing("Swap day not found."));checkEditable(owner,other);LocalDate a=day.scheduledDate,b=other.scheduledDate;
   day.scheduledDate=LocalDate.of(9999,12,31);days.flush();other.scheduledDate=a;days.flush();day.scheduledDate=b;
  }else if(edit.date()!=null){if(edit.date().isBefore(LocalDate.now(clock))||edit.date().isAfter(LocalDate.now(clock).plusDays(90))||list.stream().anyMatch(d->!d.id.equals(day.id)&&d.scheduledDate.equals(edit.date())))throw DietException.invalid("Choose an unused future date, or swap two days.");day.scheduledDate=edit.date();}
  else {var seq=new ArrayList<>(json.list(day.exercisesJson,Prescription.class));Profile p=profile(owner);String target=edit.replacementId();
   if(target==null)throw DietException.invalid("Choose an exercise to add or replace.");var ex=catalog.get(target);if(!ExerciseCatalogService.eligible(ex,p)||p.seriousLimitation())throw DietException.invalid("Exercise does not match your current profile or movement restrictions.");
   if(seq.stream().anyMatch(x->x.exerciseId().equals(target)))throw DietException.invalid("This exercise is already in the workout.");
   if(edit.add()){if(day.kind.equals("REST"))throw DietException.invalid("Keep rest days for recovery.");seq.add(new Prescription(target,"MAIN",1,ex.durationSeconds()>0?0:6,ex.durationSeconds()>0?ex.durationSeconds():24,60));}
   else {int index=-1;for(int i=0;i<seq.size();i++)if(seq.get(i).exerciseId().equals(edit.exerciseId()))index=i;if(index<0)throw DietException.missing("Exercise not in this day.");var old=seq.get(index);if(!catalog.get(old.exerciseId()).pattern().equals(ex.pattern()))throw DietException.invalid("Choose an alternative with the same movement pattern.");seq.set(index,new Prescription(target,old.phase(),old.sets(),ex.durationSeconds()>0?0:old.reps()>0?old.reps():6,ex.durationSeconds()>0?ex.durationSeconds():24,old.restSeconds()));}
   if(WorkoutPlanGenerator.minutes(seq)>p.durationMinutes())throw DietException.invalid("This addition exceeds your workout duration. Replace an exercise instead.");day.exercisesJson=json.write(seq);day.estimatedMinutes=WorkoutPlanGenerator.minutes(seq);
  }
  verifyRecovery(list);days.flush();plan.updatedAt=clock.instant();plans.saveAndFlush(plan);return view(plan);
 }
 private void checkEditable(String owner,DayEntity day){if(day.scheduledDate.isBefore(LocalDate.now(clock))||sessions.findByUserIdAndStatusInOrderByStartedAtDesc(owner,List.of("RUNNING","PAUSED","COMPLETED")).stream().anyMatch(s->s.dayId.equals(day.id)))throw DietException.invalid("Started or past workout days are preserved. Generate a new plan to change future workouts.");}
 private void verifyRecovery(List<DayEntity> list){for(var a:list)for(var b:list)if(a.scheduledDate.plusDays(1).equals(b.scheduledDate)&&a.kind.equals("TRAINING")&&b.kind.equals("TRAINING")){Set<String> ma=mainMuscles(a);if(!Collections.disjoint(ma,mainMuscles(b)))throw DietException.invalid("This change trains overlapping muscles on consecutive days. Keep a recovery day or alternate upper and lower body.");}}
 private Set<String> mainMuscles(DayEntity d){var set=new HashSet<String>();json.list(d.exercisesJson,Prescription.class).stream().filter(x->x.phase().equals("MAIN")).forEach(x->set.addAll(WorkoutPlanGenerator.muscles(catalog.get(x.exerciseId()))));return set;}
}
