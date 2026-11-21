package com.gymfit.home;

import com.gymfit.home.HomeDtos.*;
import com.gymfit.home.HomeEntities.*;
import com.gymfit.exception.DietException;
import org.springframework.stereotype.Service;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class ExerciseCatalogService implements ApplicationRunner {
 private final HomeRepositories.Exercises repo;private final HomeJson json;
 public ExerciseCatalogService(HomeRepositories.Exercises repo,HomeJson json){this.repo=repo;this.json=json;}
 @Override @Transactional public void run(ApplicationArguments args)throws Exception {
  String raw=new ClassPathResource("catalog/home-exercises.json").getContentAsString(StandardCharsets.UTF_8);
  List<Exercise> catalog=json.list(raw,Exercise.class);
  Set<String> ids=new HashSet<>();
  for(Exercise e:catalog)if(!ids.add(e.id())||e.instructions().size()<3)throw new IllegalStateException("Invalid home catalog: "+e.id());
  if(ids.size()<80)throw new IllegalStateException("Home catalog requires at least 80 exercises");
  for(Exercise e:catalog){var old=repo.findById(e.id());if(old.isEmpty()||old.get().catalogVersion<1){var row=old.orElseGet(ExerciseEntity::new);row.id=e.id();row.contentJson=json.write(e);row.catalogVersion=1;repo.save(row);}}
 }
 @Transactional(readOnly=true) public List<Exercise> all(){return repo.findAll().stream().map(e->json.read(e.contentJson,Exercise.class)).sorted(Comparator.comparing(Exercise::id)).toList();}
 @Transactional(readOnly=true) public Exercise get(String id){return repo.findById(id).map(e->json.read(e.contentJson,Exercise.class)).orElseThrow(()->DietException.missing("Home exercise not found."));}
 public static int rank(String level){return switch(level){case "BEGINNER"->0;case "INTERMEDIATE"->1;case "ADVANCED"->2;default->-1;};}
 public static boolean eligible(Exercise e,Profile p){return rank(e.difficulty())<=rank(p.level())&&p.equipment().containsAll(e.equipment())&&Collections.disjoint(p.limitations(),e.limitationTags())&&(!p.lowImpact()||!e.limitationTags().contains("JUMPING"))&&!p.discomfortExercises().contains(e.id());}
 public Page<Exercise> search(String q,String muscle,String equipment,String difficulty,String category,int page,int size){
  if(page<0||size<1||size>100)throw DietException.invalid("Page must be non-negative; size must be 1–100.");
  String needle=q.toLowerCase(Locale.ROOT);var matches=all().stream().filter(e->(e.name()+" "+e.description()).toLowerCase(Locale.ROOT).contains(needle))
   .filter(e->muscle.isBlank()||e.primaryMuscle().equals(muscle)||e.secondaryMuscles().contains(muscle))
   .filter(e->equipment.isBlank()||(equipment.equals("NONE")?e.equipment().isEmpty():e.equipment().stream().allMatch(x->x.equals(equipment))))
   .filter(e->difficulty.isBlank()||e.difficulty().equals(difficulty)).filter(e->category.isBlank()||e.category().equals(category)).toList();
  int start=(int)Math.min((long)page*size,matches.size());return new Page<>(matches.subList(start,Math.min(start+size,matches.size())),page,size,matches.size());
 }
}
