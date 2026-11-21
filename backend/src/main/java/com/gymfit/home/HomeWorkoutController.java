package com.gymfit.home;

import com.gymfit.home.HomeDtos.*;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import java.security.Principal;
import java.util.*;

@RestController @RequestMapping("/api/v1/home-workouts")
public class HomeWorkoutController {
 private final HomeWorkoutService workouts;private final ExerciseCatalogService catalog;private final WorkoutSessionService sessions;private final WorkoutProgressService progress;
 public HomeWorkoutController(HomeWorkoutService workouts,ExerciseCatalogService catalog,WorkoutSessionService sessions,WorkoutProgressService progress){this.workouts=workouts;this.catalog=catalog;this.sessions=sessions;this.progress=progress;}
 @GetMapping("/exercises") public Page<Exercise> exercises(@RequestParam(defaultValue="")String q,@RequestParam(defaultValue="")String muscle,@RequestParam(defaultValue="")String equipment,@RequestParam(defaultValue="")String difficulty,@RequestParam(defaultValue="")String category,@RequestParam(defaultValue="0")int page,@RequestParam(defaultValue="24")int size){return catalog.search(q,muscle,equipment,difficulty,category,page,size);}
 @GetMapping("/exercises/{id}") public Exercise exercise(@PathVariable String id){return catalog.get(id);}
 @GetMapping("/muscles") public List<String> muscles(){return HomeWorkoutService.MUSCLES.stream().sorted().toList();}
 @GetMapping("/profile") public Profile profile(Principal p){return workouts.profile(p.getName());}
 @PutMapping("/profile") public Profile profile(Principal p,@Valid @RequestBody Profile body){return workouts.saveProfile(p.getName(),body);}
 @PostMapping("/plans/generate") @ResponseStatus(HttpStatus.CREATED) public PlanView generate(Principal p,@Valid @RequestBody Generate body){return workouts.generate(p.getName(),body);}
 @GetMapping("/plans/current") public PlanView current(Principal p){return workouts.current(p.getName());}
 @GetMapping("/plans/{id}") public PlanView plan(Principal p,@PathVariable long id){return workouts.get(p.getName(),id);}
 @PatchMapping("/plans/{id}") public PlanView edit(Principal p,@PathVariable long id,@Valid @RequestBody PlanEdit body){return workouts.edit(p.getName(),id,body);}
 @PostMapping("/sessions") @ResponseStatus(HttpStatus.CREATED) public SessionView start(Principal p,@Valid @RequestBody Start body){return sessions.start(p.getName(),body);}
 @GetMapping("/sessions/active") public SessionView active(Principal p){return sessions.active(p.getName());}
 @GetMapping("/sessions/{id}") public SessionView session(Principal p,@PathVariable long id){return sessions.get(p.getName(),id);}
 @PatchMapping("/sessions/{id}") public SessionView session(Principal p,@PathVariable long id,@Valid @RequestBody SessionEdit body){return sessions.edit(p.getName(),id,body);}
 @PostMapping("/sessions/{id}/complete") public SessionView complete(Principal p,@PathVariable long id,@Valid @RequestBody SessionEdit body){return sessions.edit(p.getName(),id,new SessionEdit(body.version(),"COMPLETE",null,null,null,null,null,null,body.notes(),body.pain()));}
 @GetMapping("/history") public Page<SessionView> history(Principal p,@RequestParam(defaultValue="0")int page,@RequestParam(defaultValue="20")int size){return sessions.history(p.getName(),page,size);}
 @GetMapping("/progress") public Progress progress(Principal p){return progress.progress(p.getName());}
 @GetMapping("/challenges") public List<ChallengeView> challenges(Principal p){return progress.challenges(p.getName());}
 @PostMapping("/challenges/{id}/join") public ChallengeView join(Principal p,@PathVariable String id){return progress.join(p.getName(),id);}
}
