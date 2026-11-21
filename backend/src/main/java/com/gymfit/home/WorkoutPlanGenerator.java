package com.gymfit.home;

import com.gymfit.home.HomeDtos.*;
import com.gymfit.exception.DietException;
import org.springframework.stereotype.Component;
import java.time.*;
import java.util.*;

@Component
public class WorkoutPlanGenerator {
 public record Draft(LocalDate date,String title,String kind,List<Prescription> exercises,double minutes) {}
 public static final Map<String,Integer> QUICK=Map.of("beginner-10",10,"full-body-15",15,"fitness-20",20,"muscle-30",30,"core",15,"no-jumping",20,"mobility",15);
 public List<Draft> generate(Profile p,LocalDate start,String quick,List<Exercise> catalog,Set<String> recentlyTrained,boolean progression){
  if(p.seriousLimitation()||!p.injuryNotes().isBlank()&&p.limitations().isEmpty())throw DietException.invalid("Please obtain qualified guidance for the reported limitation before generating a plan. Add known movement restrictions to your profile; this planner does not provide rehabilitation.");
  if(quick!=null&&!quick.isBlank()&&!QUICK.containsKey(quick))throw DietException.invalid("Unknown quick program.");
  boolean single=quick!=null&&!quick.isBlank();int budget=single?QUICK.get(quick):p.durationMinutes();
  var eligible=catalog.stream().filter(e->ExerciseCatalogService.eligible(e,p)).filter(e->!"no-jumping".equals(quick)||!e.limitationTags().contains("JUMPING"))
   .filter(e->!"beginner-10".equals(quick)||e.difficulty().equals("BEGINNER")).toList();
  var training=switch(p.daysPerWeek()){case 2->Set.of(0,3);case 3->Set.of(0,2,4);case 4->Set.of(0,1,3,4);case 5->Set.of(0,1,2,4,5);default->Set.of(0,1,2,3,4,5);};
  List<Draft> result=new ArrayList<>();int strengthIndex=0;Set<String> yesterday=recentlyTrained;
  for(int i=0;i<(single?1:7);i++){
   boolean rest=!single&&!training.contains(i);
   boolean gentle="mobility".equals(quick)||(!single&&(p.goal().equals("MOBILITY")||(p.daysPerWeek()>=5&&i%3==2)||(p.goal().equals("CORE")&&!yesterday.isEmpty())));
   if(rest){result.add(new Draft(start.plusDays(i),"Rest & recovery","REST",List.of(),0));yesterday=Set.of();continue;}
   boolean split=!single&&p.daysPerWeek()>=4;
   boolean upper=(strengthIndex++%2==0);
   List<String> patterns=gentle?List.of("MOBILITY"):"core".equals(quick)||(!single&&p.goal().equals("CORE"))?List.of("CORE_STABILITY"):
    split?(upper?List.of("PUSH","PULL","SCAPULAR","OVERHEAD_PUSH","CURL","ELBOW_EXTENSION"):List.of("SQUAT","HINGE","LUNGE","CALF","HIP_ABDUCTION")):
    List.of("SQUAT","PUSH","PULL","HINGE","CORE_STABILITY","SCAPULAR","CALF");
   if(!gentle&&((!single&&(p.goal().equals("ENDURANCE")||p.goal().equals("WEIGHT_LOSS")))||"fitness-20".equals(quick)||"no-jumping".equals(quick))){
    var more=new ArrayList<String>();more.add("CARDIO");more.addAll(patterns);patterns=more;
   }
   List<Prescription> seq=new ArrayList<>();Set<String> used=new HashSet<>();int available=budget*60;
   Exercise warm=eligible.stream().filter(e->e.id().equals("marching-in-place")).findFirst().orElse(null);
   if(warm!=null&&!gentle){seq.add(new Prescription(warm.id(),"WARM_UP",1,0,60,0));used.add(warm.id());available-=cost(1,60,0);}
   // Reserve a gentle cool-down. No exercise is assumed safe merely because it is a stretch.
   Exercise cool=eligible.stream().filter(e->e.category().equals("MOBILITY")).findFirst().orElse(null);
   if(cool!=null){available-=cost(1,60,0);used.add(cool.id());}
   Set<String> prior=yesterday;
   for(String pattern:patterns){
    List<Exercise> candidates=eligible.stream().filter(e->e.pattern().equals(pattern)&&!used.contains(e.id()))
     .filter(e->gentle||e.category().equals("MOBILITY")||Collections.disjoint(muscles(e),prior))
     .sorted(Comparator.<Exercise>comparingInt(e->score(e,p)).reversed().thenComparing(Exercise::id)).toList();
    if(candidates.isEmpty())continue;
    // Mobility-only sessions can include multiple distinct regions.
    int count=gentle?Math.min(8,candidates.size()):pattern.equals("CORE_STABILITY")&&"core".equals(quick)?Math.min(4,candidates.size()):1;
    for(Exercise exercise:candidates.subList(0,count)){
     int sets=gentle?1:p.level().equals("BEGINNER")?2:3;
     int reps=exercise.durationSeconds()>0?0:(p.level().equals("BEGINNER")?6:8)+(progression?1:0);
     int seconds=exercise.durationSeconds()>0?exercise.durationSeconds():reps*4;
     int restSeconds=gentle?15:p.level().equals("BEGINNER")?60:75;
     while(sets>1&&cost(sets,seconds,restSeconds)>available)sets--;
     int cost=cost(sets,seconds,restSeconds);if(cost>available)continue;
     seq.add(new Prescription(exercise.id(),gentle?"MOBILITY":"MAIN",sets,reps,seconds,restSeconds));used.add(exercise.id());available-=cost;
    }
   }
   if(seq.stream().noneMatch(e->e.phase().equals("MAIN")||e.phase().equals("MOBILITY")))throw DietException.invalid("No suitable workout fits this equipment, recovery window and movement restrictions. Try a later start date or seek qualified guidance.");
   if(cool!=null)seq.add(new Prescription(cool.id(),"COOL_DOWN",1,0,60,0));
   yesterday=new HashSet<>();for(var r:seq)if(r.phase().equals("MAIN")){var e=eligible.stream().filter(x->x.id().equals(r.exerciseId())).findFirst().orElseThrow();yesterday.addAll(muscles(e));}
   String title=single?quick.replace('-',' '):gentle?"Mobility & light recovery":split?(upper?"Upper body":"Lower body"):"Full body";
   result.add(new Draft(start.plusDays(i),title,gentle?"RECOVERY":"TRAINING",List.copyOf(seq),minutes(seq)));
  }
  return result;
 }
 private int score(Exercise e,Profile p){int score=30-ExerciseCatalogService.rank(e.difficulty())*5;if(p.focusMuscles().contains(e.primaryMuscle()))score+=8;if(!e.equipment().isEmpty())score+=3;if(e.id().equals("bodyweight-squat")||e.id().equals("wall-push-up")||e.id().equals("dead-bug")||e.id().equals("glute-bridge"))score+=5;return score;}
 public static Set<String> muscles(Exercise e){var out=new HashSet<String>(e.secondaryMuscles());out.add(e.primaryMuscle());out.remove("FULL_BODY");return out;}
 public static int cost(int sets,int seconds,int rest){return sets*seconds+Math.max(0,sets-1)*rest+15;}
 public static double minutes(List<Prescription> seq){return Math.round(seq.stream().mapToInt(e->cost(e.sets(),e.seconds(),e.restSeconds())).sum()/60.0*10)/10.0;}
}
