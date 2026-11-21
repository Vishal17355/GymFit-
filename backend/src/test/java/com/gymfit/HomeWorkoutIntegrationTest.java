package com.gymfit;

import com.fasterxml.jackson.databind.*;
import com.gymfit.home.*;
import com.gymfit.home.HomeDtos.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.*;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import java.time.*;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test")
class HomeWorkoutIntegrationTest {
 @Autowired MockMvc mvc;@Autowired ObjectMapper json;@Autowired ExerciseCatalogService catalog;
 @Autowired HomeRepositories.Sessions sessions;@Autowired HomeRepositories.Plans plans;@Autowired HomeJson codec;
 String owner;static final String ROOT="/api/v1/home-workouts";
 @BeforeEach void userName(){owner="home-test-"+UUID.randomUUID();}
 @DynamicPropertySource static void database(DynamicPropertyRegistry properties){String url=System.getenv("GYMFIT_TEST_DB_URL");if(url!=null){properties.add("spring.datasource.url",()->url);properties.add("spring.datasource.username",()->System.getenv("GYMFIT_TEST_DB_USERNAME"));properties.add("spring.datasource.password",()->System.getenv().getOrDefault("GYMFIT_TEST_DB_PASSWORD",""));}}
 Profile profile(String level,int days,int minutes,Set<String> equipment){return new Profile(24,175,75,level,"MUSCLE_GAIN","New to training",days,minutes,"07:00",equipment,Set.of(),Set.of(),Set.of(),"",true,false);}
 JsonNode call(MockHttpServletRequestBuilder request,Object body,int expected)throws Exception{if(body!=null)request.contentType("application/json").content(json.writeValueAsString(body));String raw=mvc.perform(request.with(user(owner))).andExpect(status().is(expected)).andReturn().getResponse().getContentAsString();return raw.isBlank()?null:json.readTree(raw);}
 void save(Profile p)throws Exception{call(put(ROOT+"/profile"),p,200);}
 JsonNode generate(int days,int duration)throws Exception{save(profile("BEGINNER",days,duration,Set.of()));return call(post(ROOT+"/plans/generate"),new Generate(LocalDate.now(),null,false),201);}
 JsonNode start(JsonNode plan)throws Exception{return call(post(ROOT+"/sessions"),new Start(plan.path("id").asLong(),plan.path("days").get(0).path("id").asLong()),201);}
 Map<String,Object> action(JsonNode s,String action){Map<String,Object> map=new HashMap<>();map.put("version",s.path("version").asLong());map.put("action",action);return map;}
 @Test void profileValidationAndNoClientIdentity()throws Exception{
  call(put(ROOT+"/profile"),Map.of("userId","other","age",-1),400);
  var p=profile("NOVICE",3,20,Set.of());call(put(ROOT+"/profile"),p,422);
  p=profile("BEGINNER",3,17,Set.of());call(put(ROOT+"/profile"),p,422);
  save(profile("BEGINNER",3,20,Set.of()));assertEquals(75,call(get(ROOT+"/profile"),null,200).path("weightKg").asDouble());
 }
 @Test void catalogMetadataPaginationAndEquipmentFilters()throws Exception{
  var all=catalog.all();assertTrue(all.size()>=80);assertEquals(all.size(),all.stream().map(Exercise::id).distinct().count());
  for(var e:all){assertTrue(e.instructions().size()>=3);assertNotNull(e.thumbnail());assertNull(e.mediaUrl());assertFalse(e.safety().isEmpty());for(var id:e.easier())assertNotNull(catalog.get(id));}
  var none=call(get(ROOT+"/exercises?equipment=NONE&difficulty=BEGINNER&size=100"),null,200);assertTrue(none.path("total").asInt()>20);for(var e:none.path("items"))assertEquals(0,e.path("equipment").size());
  var chest=call(get(ROOT+"/exercises?muscle=CHEST&q=push&size=3"),null,200);assertEquals(3,chest.path("items").size());assertTrue(chest.path("total").asInt()>3);
  call(get(ROOT+"/exercises?size=10000"),null,422);call(get(ROOT+"/exercises/missing"),null,404);
 }
 @Test void deterministicPlansRecoveryAndBeginnerVolume()throws Exception{
  var first=generate(4,30);var second=call(post(ROOT+"/plans/generate"),new Generate(LocalDate.now(),null,false),201);
  assertEquals(7,first.path("days").size());int training=0;
  for(int i=0;i<7;i++){var a=first.path("days").get(i);var b=second.path("days").get(i);assertEquals(a.path("exercises"),b.path("exercises"));if(a.path("kind").asText().equals("TRAINING"))training++;assertTrue(a.path("estimatedMinutes").asDouble()<=30);
   Set<String> current=new HashSet<>();for(var ex:a.path("exercises")){var e=catalog.get(ex.path("exerciseId").asText());assertEquals("BEGINNER",e.difficulty());assertTrue(e.equipment().isEmpty());assertTrue(ex.path("sets").asInt()<=2);if(ex.path("phase").asText().equals("MAIN"))current.addAll(WorkoutPlanGenerator.muscles(e));}
   if(i>0){var prior=first.path("days").get(i-1);for(var ex:prior.path("exercises"))if(ex.path("phase").asText().equals("MAIN"))assertTrue(Collections.disjoint(current,WorkoutPlanGenerator.muscles(catalog.get(ex.path("exerciseId").asText()))));}
  }assertEquals(4,training);assertTrue(first.path("notices").toString().contains("pulling equipment"));
 }
 @Test void sixDayPlanIncludesRecoveryAndQuickProgramsAreActualSequences()throws Exception{
  var p=generate(6,10);assertEquals(2,p.path("days").findValuesAsText("kind").stream().filter("RECOVERY"::equals).count());
  for(var quick:WorkoutPlanGenerator.QUICK.keySet()){var generated=call(post(ROOT+"/plans/generate"),new Generate(LocalDate.now(),quick,false),201);assertEquals(1,generated.path("days").size());assertTrue(generated.path("days").get(0).path("exercises").size()>1);}
 }
 @Test void seriousLimitationsStopAutomaticPrescription()throws Exception{
  var p=profile("BEGINNER",3,20,Set.of());save(new Profile(p.age(),p.heightCm(),p.weightKg(),p.level(),p.goal(),p.experience(),p.daysPerWeek(),p.durationMinutes(),p.preferredTime(),p.equipment(),p.focusMuscles(),Set.of("KNEE"),Set.of(),"Significant limitation",true,true));
  call(post(ROOT+"/plans/generate"),new Generate(LocalDate.now(),null,false),422);
 }
 @Test void sessionLifecyclePersistenceAndIdempotentSetLogging()throws Exception{
  var p=generate(3,20);var s=start(p);assertEquals(s.path("id"),start(p).path("id"));long id=s.path("id").asLong();
  var prescription=s.path("exercises").get(1);var body=action(s,"SET");body.put("exerciseId",prescription.path("exerciseId").asText());body.put("setNumber",1);body.put("reps",6);body.put("seconds",0);
  s=call(patch(ROOT+"/sessions/"+id),body,200);assertEquals(1,s.path("sets").size());
  body.put("version",s.path("version").asLong());s=call(patch(ROOT+"/sessions/"+id),body,200);assertEquals(1,s.path("sets").size());
  s=call(patch(ROOT+"/sessions/"+id),action(s,"PAUSE"),200);assertEquals("PAUSED",s.path("status").asText());
  s=call(get(ROOT+"/sessions/"+id),null,200);assertEquals(1,s.path("sets").size());
  s=call(patch(ROOT+"/sessions/"+id),action(s,"RESUME"),200);assertEquals("RUNNING",s.path("status").asText());
  s=call(post(ROOT+"/sessions/"+id+"/complete"),action(s,"COMPLETE"),200);assertEquals("COMPLETED",s.path("status").asText());
  assertEquals(1,call(get(ROOT+"/progress"),null,200).path("completedWorkouts").asInt());assertEquals(1,call(get(ROOT+"/history"),null,200).path("total").asInt());
  var newPlan=call(post(ROOT+"/plans/generate"),new Generate(LocalDate.now().plusDays(3),null,false),201);assertNotEquals(p.path("id"),newPlan.path("id"));assertEquals(1,call(get(ROOT+"/history"),null,200).path("total").asInt());
 }
 @Test void painPausesAndPreventsResumingOrIncreasingVolume()throws Exception{
  var s=start(generate(3,20));var body=action(s,"PAUSE");body.put("pain",true);s=call(patch(ROOT+"/sessions/"+s.path("id").asLong()),body,200);assertTrue(s.path("painReported").asBoolean());
  call(patch(ROOT+"/sessions/"+s.path("id").asLong()),action(s,"RESUME"),422);
 }
 @Test void ownershipFutureSessionsAndAnonymousAccessAreRejected()throws Exception{
  var plan=generate(3,20);var s=start(plan);String original=owner;owner="different-user";
  call(get(ROOT+"/plans/"+plan.path("id").asLong()),null,404);call(get(ROOT+"/sessions/"+s.path("id").asLong()),null,404);
  call(patch(ROOT+"/sessions/"+s.path("id").asLong()),action(s,"COMPLETE"),404);
  assertEquals(0,call(get(ROOT+"/history"),null,200).path("total").asInt());owner=original;
  mvc.perform(get(ROOT+"/history").with(anonymous())).andExpect(status().isUnauthorized());
 }
 @Test void editingCompletedDaysAndStaleVersionsAreRejected()throws Exception{
  var p=generate(3,30);long id=p.path("id").asLong();long day=p.path("days").get(0).path("id").asLong();
  var moved=call(patch(ROOT+"/plans/"+id),new PlanEdit(0L,day,null,LocalDate.now().plusDays(8),null,null,false),200);assertEquals(1,moved.path("version").asLong());
  call(patch(ROOT+"/plans/"+id),new PlanEdit(0L,day,null,LocalDate.now().plusDays(9),null,null,false),409);
  call(post(ROOT+"/sessions"),new Start(id,day),422);
 }
 @Test void challengesUseActualSessionDatesAndDoNotInventProgress()throws Exception{
  var initial=call(get(ROOT+"/progress"),null,200);assertEquals(0,initial.path("completedWorkouts").asInt());
  var joined=call(post(ROOT+"/challenges/beginner-7/join"),null,200);assertEquals(0,joined.path("completed").asInt());assertTrue(joined.path("tasks").findValuesAsText("rest").contains("true"));
  assertEquals(joined,call(post(ROOT+"/challenges/beginner-7/join"),null,200));
 }
 @Test void calorieFormulaUsesGrossMetAndDuration(){assertEquals(85.75,WorkoutSessionService.calories(3.5,70,20),0.0001);assertEquals(0,WorkoutSessionService.calories(3.5,70,0));}
}

