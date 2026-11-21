package com.gymfit.home;

import com.gymfit.home.HomeDtos.*;
import com.gymfit.home.HomeEntities.*;
import com.gymfit.exception.DietException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.PageRequest;
import java.time.*;
import java.util.*;

@Service @Transactional
public class WorkoutSessionService {
 private final HomeRepositories.Sessions repo;private final HomeRepositories.Profiles profiles;private final HomeRepositories.Days days;
 private final HomeWorkoutService workouts;private final ExerciseCatalogService catalog;private final HomeJson json;private final Clock clock;
 public WorkoutSessionService(HomeRepositories.Sessions repo,HomeRepositories.Profiles profiles,HomeRepositories.Days days,HomeWorkoutService workouts,ExerciseCatalogService catalog,HomeJson json,Clock clock){this.repo=repo;this.profiles=profiles;this.days=days;this.workouts=workouts;this.catalog=catalog;this.json=json;this.clock=clock;}
 public SessionEntity owned(String owner,long id){return repo.findByIdAndUserId(id,owner).orElseThrow(()->DietException.missing("Workout session not found."));}
 public SessionView get(String owner,long id){return view(owned(owner,id));}
 public SessionView active(String owner){return repo.findByUserIdAndStatusInOrderByStartedAtDesc(owner,List.of("RUNNING","PAUSED")).stream().findFirst().map(this::view).orElse(null);}
 public SessionView start(String owner,Start request){
  profiles.lockOwner(owner).orElseThrow(()->DietException.missing("Complete your home-workout profile first."));
  var plan=workouts.owned(owner,request.planId());var profile=workouts.profile(owner);
  if(profile.seriousLimitation())throw DietException.invalid("Obtain qualified guidance before starting an automated workout.");
  var day=days.findById(request.dayId()).filter(d->d.planId.equals(plan.id)).orElseThrow(()->DietException.missing("Workout day not found."));
  var active=active(owner);if(active!=null)return active;
  if(day.kind.equals("REST"))throw DietException.invalid("This is a rest day. Choose a training or mobility day.");
  if(!day.scheduledDate.equals(LocalDate.now(clock)))throw DietException.invalid("Start a workout scheduled for today. Reschedule future workouts first.");
  var seq=json.list(day.exercisesJson,Prescription.class);
  if(seq.stream().anyMatch(x->!ExerciseCatalogService.eligible(catalog.get(x.exerciseId()),profile)))throw DietException.invalid("Your restrictions or equipment changed. Generate a new suitable plan.");
  var completed=repo.findByUserIdAndStatusInOrderByStartedAtDesc(owner,List.of("COMPLETED"));
  if(completed.stream().anyMatch(s->s.dayId.equals(day.id)))throw DietException.invalid("This workout is already completed.");
  var trained=new HashSet<String>();completed.stream().filter(s->s.sessionDate.equals(LocalDate.now(clock))||s.sessionDate.equals(LocalDate.now(clock).minusDays(1)))
   .forEach(s->json.list(s.setsJson,SetLog.class).stream().filter(log->json.list(s.exercisesJson,Prescription.class).stream().anyMatch(x->x.exerciseId().equals(log.exerciseId())&&x.phase().equals("MAIN"))).forEach(log->trained.addAll(WorkoutPlanGenerator.muscles(catalog.get(log.exerciseId())))));
  if(seq.stream().filter(x->x.phase().equals("MAIN")).anyMatch(x->!Collections.disjoint(trained,WorkoutPlanGenerator.muscles(catalog.get(x.exerciseId())))))throw DietException.invalid("These muscles were trained today or yesterday. Choose mobility or rest and reschedule for recovery.");
  var s=new SessionEntity();s.userId=owner;s.planId=plan.id;s.dayId=day.id;s.sessionDate=LocalDate.now(clock);s.startedAt=clock.instant();s.runningSince=clock.instant();s.status="RUNNING";s.exercisesJson=day.exercisesJson;s.setsJson="[]";s.skippedJson="[]";s.notes="";s.weightKg=profile.weightKg();repo.saveAndFlush(s);return view(s);
 }
 public SessionView edit(String owner,long id,SessionEdit edit){
  var s=owned(owner,id);if(s.version!=edit.version())throw new DietException(HttpStatus.CONFLICT,"STALE_SESSION","This session changed in another tab. Reload the saved session before continuing.");
  if(!Set.of("RUNNING","PAUSED").contains(s.status))throw DietException.invalid("This workout has already ended.");
  var seq=new ArrayList<>(json.list(s.exercisesJson,Prescription.class));var logs=new ArrayList<>(json.list(s.setsJson,SetLog.class));var skipped=new HashSet<>(json.list(s.skippedJson,String.class));
  if(edit.notes()!=null)s.notes=edit.notes();
  if(edit.pain()){s.painReported=true;pause(s);s.status="PAUSED";}
  switch(edit.action()){
   case "PAUSE"->{pause(s);s.status="PAUSED";}
   case "RESUME"->{if(s.painReported)throw DietException.invalid("Pain was reported. Finish this session and seek guidance instead of resuming.");if(s.status.equals("PAUSED")){s.runningSince=clock.instant();s.status="RUNNING";}}
   case "CURSOR"->{if(edit.cursor()==null||edit.cursor()<0||edit.cursor()>=seq.size())throw DietException.invalid("Invalid exercise position.");s.cursorIndex=edit.cursor();}
   case "SET"->{
    if(!s.status.equals("RUNNING")||s.painReported)throw DietException.invalid("Resume a pain-free session before completing a set.");
    var prescription=seq.stream().filter(x->x.exerciseId().equals(edit.exerciseId())).findFirst().orElseThrow(()->DietException.missing("Exercise not in this session."));
    if(skipped.contains(edit.exerciseId())||edit.setNumber()==null||edit.setNumber()<1||edit.setNumber()>prescription.sets()||edit.reps()==null||edit.seconds()==null)throw DietException.invalid("Supply a valid set number, repetitions and seconds.");
    if(logs.stream().noneMatch(x->x.exerciseId().equals(edit.exerciseId())&&x.setNumber()==edit.setNumber())){
     int duration=edit.seconds();if(edit.reps()==0&&duration==0)throw DietException.invalid("Record repetitions or activity time before completing a set.");long logged=logs.stream().mapToLong(SetLog::seconds).sum();if(logged+duration>elapsed(s))throw DietException.invalid("Logged exercise time cannot exceed the elapsed workout timer.");
     logs.add(new SetLog(edit.exerciseId(),edit.setNumber(),edit.reps(),duration,clock.instant()));
    }
   }
   case "SKIP"->{var ex=seq.stream().filter(x->x.exerciseId().equals(edit.exerciseId())).findFirst().orElseThrow(()->DietException.missing("Exercise not in this session."));skipped.add(ex.exerciseId());}
   case "REPLACE"->{
    int index=-1;for(int i=0;i<seq.size();i++)if(seq.get(i).exerciseId().equals(edit.exerciseId()))index=i;
    if(index<0)throw DietException.missing("Exercise not in this session.");
    if(logs.stream().anyMatch(x->x.exerciseId().equals(edit.exerciseId())))throw DietException.invalid("Keep logged exercises unchanged; skip remaining sets instead.");
    var replacement=catalog.get(edit.replacementId());var original=seq.get(index);
    if(!ExerciseCatalogService.eligible(replacement,workouts.profile(owner))||!replacement.pattern().equals(catalog.get(original.exerciseId()).pattern())||seq.stream().anyMatch(x->x.exerciseId().equals(replacement.id())))throw DietException.invalid("Choose an unused, suitable alternative of the same movement pattern.");
    seq.set(index,new Prescription(replacement.id(),original.phase(),original.sets(),replacement.durationSeconds()>0?0:6,replacement.durationSeconds()>0?replacement.durationSeconds():24,original.restSeconds()));skipped.remove(edit.exerciseId());
   }
   case "SAVE"->{}
   case "COMPLETE"->{pause(s);s.status=logs.isEmpty()?"CANCELLED":"COMPLETED";s.endedAt=clock.instant();}
   default->throw DietException.invalid("Unknown workout action.");
  }
  s.setsJson=json.write(logs);s.exercisesJson=json.write(seq);s.skippedJson=json.write(skipped.stream().sorted().toList());repo.saveAndFlush(s);return view(s);
 }
 public long elapsed(SessionEntity s){long running=s.runningSince==null?0:Math.max(0,Duration.between(s.runningSince,clock.instant()).toSeconds());return Math.min(7200,s.activeSeconds+running);}
 private void pause(SessionEntity s){s.activeSeconds=elapsed(s);s.runningSince=null;}
 public static double calories(double met,double kg,double minutes){return met*3.5*kg/200*minutes;}
 public SessionView view(SessionEntity s){
  var seq=json.list(s.exercisesJson,Prescription.class);var logs=json.list(s.setsJson,SetLog.class);long duration=elapsed(s);long active=logs.stream().mapToLong(SetLog::seconds).sum();
  double energy=0;Set<String> muscles=new TreeSet<>();for(var log:logs){var e=catalog.get(log.exerciseId());energy+=calories(e.met(),s.weightKg,log.seconds()/60.0);muscles.addAll(WorkoutPlanGenerator.muscles(e));}
  energy+=calories(1.3,s.weightKg,Math.max(0,duration-active)/60.0);
  return new SessionView(s.id,s.planId,s.dayId,s.sessionDate,s.status,s.startedAt,s.endedAt,s.version,duration,s.cursorIndex,seq,logs,new HashSet<>(json.list(s.skippedJson,String.class)),s.notes,s.painReported,Math.round(energy*10)/10.0,muscles);
 }
 public Page<SessionView> history(String owner,int page,int size){if(page<0||size<1||size>50)throw DietException.invalid("History size must be 1–50 and page non-negative.");var result=repo.findByUserIdOrderByStartedAtDesc(owner,PageRequest.of(page,size));return new Page<>(result.stream().map(this::view).toList(),page,size,result.getTotalElements());}
}
