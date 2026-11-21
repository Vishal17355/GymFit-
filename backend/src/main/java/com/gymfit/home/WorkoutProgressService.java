package com.gymfit.home;

import com.gymfit.home.HomeDtos.*;
import com.gymfit.home.HomeEntities.*;
import com.gymfit.exception.DietException;
import com.gymfit.repository.WeightProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service @Transactional
public class WorkoutProgressService {
 private final HomeRepositories.Sessions sessions;private final HomeRepositories.Enrollments enrollments;
 private final WorkoutSessionService player;private final ExerciseCatalogService catalog;private final WeightProgressRepository weights;private final HomeJson json;private final Clock clock;
 public WorkoutProgressService(HomeRepositories.Sessions sessions,HomeRepositories.Enrollments enrollments,WorkoutSessionService player,ExerciseCatalogService catalog,WeightProgressRepository weights,HomeJson json,Clock clock){this.sessions=sessions;this.enrollments=enrollments;this.player=player;this.catalog=catalog;this.weights=weights;this.json=json;this.clock=clock;}
 public Progress progress(String owner){
  var completed=sessions.findByUserIdAndStatusInOrderByStartedAtDesc(owner,List.of("COMPLETED"));var dates=new TreeSet<LocalDate>();var best=new TreeMap<String,Best>();List<Map<String,Object>> difficulty=new ArrayList<>();long sets=0,reps=0,seconds=0;
  for(var session:completed){dates.add(session.sessionDate);seconds+=player.elapsed(session);var logs=json.list(session.setsJson,SetLog.class);sets+=logs.size();reps+=logs.stream().mapToLong(SetLog::reps).sum();Set<String> seen=new HashSet<>();for(var log:logs){var e=catalog.get(log.exerciseId());var old=best.get(e.id());best.put(e.id(),new Best(e.id(),e.name(),Math.max(log.reps(),old==null?0:old.bestReps()),Math.max(log.seconds(),old==null?0:old.bestSeconds()),e.difficulty()));if(seen.add(e.id()))difficulty.add(Map.of("date",session.sessionDate,"exerciseId",e.id(),"name",e.name(),"difficulty",e.difficulty()));}}
  LocalDate today=LocalDate.now(clock);LocalDate monday=today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));List<Week> weeks=new ArrayList<>();
  for(int i=7;i>=0;i--){LocalDate from=monday.minusWeeks(i);var week=completed.stream().filter(s->!s.sessionDate.isBefore(from)&&s.sessionDate.isBefore(from.plusWeeks(1))).toList();weeks.add(new Week(from,week.size(),Math.round(week.stream().mapToLong(player::elapsed).sum()/60.0*10)/10.0));}
  int streak=0;LocalDate cursor=dates.contains(today)?today:today.minusDays(1);while(dates.contains(cursor)){streak++;cursor=cursor.minusDays(1);}
  long distinct=dates.stream().filter(d->!d.isBefore(today.minusDays(27))&&!d.isAfter(today)).count();
  return new Progress(completed.size(),sets,reps,Math.round(seconds/60.0*10)/10.0,streak,Math.round(distinct/28.0*1000)/10.0,weeks,List.copyOf(best.values()),difficulty,
   weights.findByUserIdOrderByRecordedAt(owner).stream().map(w->new com.gymfit.dto.DietDtos.WeightView(w.id,w.weight,w.recordedAt)).toList(),
   "Consistency is days with a logged workout in the last 28 days. Streaks count consecutive logged days, not a requirement to train daily. Rest days support recovery. Personal bests compare reported repetitions or hold time, not load or total strength. Partial workouts count only when at least one set is saved.");
 }
 public static final List<Challenge> CHALLENGES=List.of(
  new Challenge("beginner-7","7-Day Beginner Fitness","Three manageable workouts separated by recovery.",7,"BEGINNER","ANY"),
  new Challenge("consistency-14","14-Day Consistency","Build a routine with rest days between sessions.",14,"BEGINNER","ANY"),
  new Challenge("home-30","30-Day Home Workout","Follow your own suitable workouts with planned recovery.",30,"BEGINNER","ANY"),
  new Challenge("push-up","Push-Up Progression","Practice a suitable push-up variation, without training to failure.",14,"BEGINNER","PUSH"),
  new Challenge("squat","Squat Progression","Practice a suitable squat with controlled technique.",14,"BEGINNER","SQUAT"),
  new Challenge("core","Core Stability","Practice a suitable core-stability exercise with comfortable breathing.",14,"BEGINNER","CORE_STABILITY"));
 public List<ChallengeView> challenges(String owner){var joined=enrollments.findByUserId(owner);return CHALLENGES.stream().map(c->challenge(c,joined.stream().filter(j->j.challengeId.equals(c.id())).findFirst().orElse(null),owner)).toList();}
 public ChallengeView join(String owner,String id){var challenge=CHALLENGES.stream().filter(c->c.id().equals(id)).findFirst().orElseThrow(()->DietException.missing("Challenge not found."));var row=enrollments.findByUserIdAndChallengeId(owner,id).orElseGet(()->{var n=new EnrollmentEntity();n.userId=owner;n.challengeId=id;n.startDate=LocalDate.now(clock);return enrollments.saveAndFlush(n);});return challenge(challenge,row,owner);}
 private ChallengeView challenge(Challenge c,EnrollmentEntity joined,String owner){
  if(joined==null)return new ChallengeView(c,null,List.of(),0,0,"NOT_JOINED");var completed=sessions.findByUserIdAndStatusInOrderByStartedAtDesc(owner,List.of("COMPLETED"));List<Task> tasks=new ArrayList<>();int required=0,done=0;
  for(int i=0;i<c.days();i++){LocalDate date=joined.startDate.plusDays(i);boolean rest=i%2==1||i==c.days()-1;boolean ok=!rest&&completed.stream().filter(s->s.sessionDate.equals(date)).anyMatch(s->qualifies(s,c.pattern()));if(!rest)required++;if(ok)done++;tasks.add(new Task(date,rest?"Rest or optional comfortable light movement":c.pattern().equals("ANY")?"Log a suitable workout from your plan":"Log a suitable "+c.pattern().toLowerCase().replace('_',' ')+" exercise",rest,ok));}
  String status=done==required?"COMPLETED":LocalDate.now(clock).isAfter(joined.startDate.plusDays(c.days()-1))?"ENDED":"ACTIVE";return new ChallengeView(c,joined.startDate,List.copyOf(tasks),done,required,status);
 }
 private boolean qualifies(SessionEntity s,String pattern){return json.list(s.setsJson,SetLog.class).stream().anyMatch(log->{var e=catalog.get(log.exerciseId());return pattern.equals("ANY")||e.pattern().equals(pattern)&&( !pattern.equals("PUSH")||e.id().contains("push-up"));});}
}
