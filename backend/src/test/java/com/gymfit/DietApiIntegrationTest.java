package com.gymfit;

import com.fasterxml.jackson.databind.*;
import com.gymfit.dto.DietDtos.*;
import com.gymfit.repository.*;
import com.gymfit.recommendation.MealRecommendationEngine;
import com.gymfit.recommendation.RecipeNutrition.Macros;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.*;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import java.time.LocalDate;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test") @Transactional
class DietApiIntegrationTest {
    @Autowired MockMvc mvc;@Autowired ObjectMapper json;@Autowired FoodRepository foods;@Autowired DietPlanRepository plans;
    @Autowired UserProfileRepository profiles;@Autowired PlatformTransactionManager transactions;
    @Autowired DietProgressReportRepository reports;
    @DynamicPropertySource static void database(DynamicPropertyRegistry properties) {
        String url=System.getenv("GYMFIT_TEST_DB_URL");
        if(url!=null){properties.add("spring.datasource.url",()->url);properties.add("spring.datasource.username",()->System.getenv("GYMFIT_TEST_DB_USERNAME"));properties.add("spring.datasource.password",()->System.getenv().getOrDefault("GYMFIT_TEST_DB_PASSWORD",""));}
    }
    String save(String who,ProfileRequest p)throws Exception{
        return mvc.perform(post("/api/v1/diet/profile").with(user(who)).contentType("application/json").content(json.writeValueAsString(p))).andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
    }
    PlanView generate(String who,int days)throws Exception{
        var response=mvc.perform(post("/api/v1/diet/generate").with(user(who)).contentType("application/json").content(json.writeValueAsString(new GenerateRequest(LocalDate.now(),days)))).andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        return json.readValue(response,PlanView.class);
    }
    @Test void differentUsersReceivePersonalizedPersistedPlans()throws Exception{
        save("alice",NutritionTest.profile(60,"VEGAN","MAINTAIN"));save("bob",NutritionTest.profile(85,"NON_VEGETARIAN","GAIN"));
        PlanView a=generate("alice",7),b=generate("bob",1);assertEquals(7,a.days().size());assertEquals(4,b.days().getFirst().meals().size());assertNotEquals(a.targets().calories(),b.targets().calories());assertNotEquals(a.days().getFirst().totals().calories(),b.days().getFirst().totals().calories());
        assertEquals(2,plans.count());
        for(var day:a.days()){var t=day.totals();assertTrue(MealRecommendationEngine.valid(new Macros(t.calories(),t.protein(),t.carbs(),t.fat(),t.cost()),a.targets(),null));}
        mvc.perform(get("/api/v1/diet/plans/"+a.id()).with(user("bob"))).andExpect(status().isNotFound());
        mvc.perform(get("/api/v1/diet/plans/"+a.id()).with(user("alice"))).andExpect(status().isOk()).andExpect(jsonPath("$.days.length()").value(7));
    }
    @Test void replacementsIntakeAndWeightArePersisted()throws Exception{
        save("athlete",NutritionTest.profile(80,"VEGETARIAN","MAINTAIN"));PlanView p=generate("athlete",1);MealView meal=p.days().getFirst().meals().getFirst();
        var response=mvc.perform(get("/api/v1/diet/plans/"+p.id()+"/meals/"+meal.id()+"/alternatives").with(user("athlete"))).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        var alternatives=json.readTree(response);assertFalse(alternatives.isEmpty());var alt=alternatives.get(0);
        mvc.perform(post("/api/v1/diet/replace-meal").with(user("athlete")).contentType("application/json").content(json.writeValueAsString(new ReplaceRequest(p.id(),meal.id(),alt.path("recipeId").asLong(),alt.path("servingMultiplier").asDouble(),p.version())))).andExpect(status().isOk()).andExpect(jsonPath("$.version").value(p.version()+1));
        mvc.perform(put("/api/v1/diet/plans/"+p.id()+"/meals/"+meal.id()+"/intake").with(user("athlete")).contentType("application/json").content(json.writeValueAsString(new IntakeRequest(true,p.version())))).andExpect(status().isConflict());
        mvc.perform(put("/api/v1/diet/plans/"+p.id()+"/meals/"+meal.id()+"/intake").with(user("athlete")).contentType("application/json").content(json.writeValueAsString(new IntakeRequest(true,p.version()+1)))).andExpect(status().isOk()).andExpect(jsonPath("$.days[0].totals.eatenMeals").value(1));
        mvc.perform(post("/api/v1/diet/progress").with(user("athlete")).contentType("application/json").content(json.writeValueAsString(new WeightRequest(79.5,LocalDate.now())))).andExpect(status().isOk());
        mvc.perform(get("/api/v1/diet/progress").with(user("athlete"))).andExpect(jsonPath("$[0].weight").value(79.5));
    }
    @Test void budgetAndAllergyConstraintsAreNotSilentlyIgnored()throws Exception{
        var base=NutritionTest.profile(70,"VEGAN","MAINTAIN");Map<Long,Double> prices=new HashMap<>();foods.findAll().forEach(f->prices.put(f.id,1.0));
        var p=new ProfileRequest(base.age(),base.sexForBmr(),base.heightCm(),base.weightKg(),base.activityLevel(),base.fitnessGoal(),base.dietaryPreference(),100.0,List.of("peanuts"),List.of(),List.of(),false,false,prices);
        save("budget",p);var plan=generate("budget",1);assertTrue(plan.days().getFirst().totals().cost()<=100);
        assertTrue(plan.days().getFirst().meals().stream().flatMap(m->m.ingredients().stream()).noneMatch(i->i.name().toLowerCase().contains("peanut")));
        var impossible=new ProfileRequest(base.age(),base.sexForBmr(),base.heightCm(),base.weightKg(),base.activityLevel(),base.fitnessGoal(),base.dietaryPreference(),.01,List.of(),List.of(),List.of(),false,false,prices);
        save("impossible",impossible);mvc.perform(post("/api/v1/diet/generate").with(user("impossible")).contentType("application/json").content("{\"startDate\":\"2026-11-20\",\"days\":1}")).andExpect(status().isUnprocessableEntity());
    }
    @Test void legacyImportIsIdempotentAndArchivedWithoutChangingNutrition()throws Exception{
        var body=new ImportRequest(NutritionTest.profile(70,"VEGETARIAN","MAINTAIN"),json.readTree("{\"plan\":{\"old\":true}}"));
        String receipt=mvc.perform(post("/api/v1/diet/import").with(user("legacy")).contentType("application/json").content(json.writeValueAsString(body))).andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        long id=json.readTree(receipt).path("id").asLong();
        mvc.perform(post("/api/v1/diet/import").with(user("legacy")).contentType("application/json").content(json.writeValueAsString(body))).andExpect(jsonPath("$.existing").value(true));
        mvc.perform(get("/api/v1/diet/imports/"+id).with(user("legacy"))).andExpect(jsonPath("$.plan.old").value(true));assertEquals(0,plans.count());
    }
    @Test void validationRejectsInvalidInputsAndClientSuppliedUserIds()throws Exception{
        mvc.perform(post("/api/v1/diet/profile").with(user("bad")).contentType("application/json").content("{\"userId\":\"someone-else\",\"age\":-1}")).andExpect(status().isBadRequest());
        mvc.perform(get("/api/v1/foods/catalog").with(user("bad"))).andExpect(status().isOk()).andExpect(jsonPath("$.foods.length()").value(18));
    }
    @Test void generatedPlansKeepSeparatePersistedProgressReports()throws Exception{
        String who="progress-report-owner";
        save(who,NutritionTest.profile(80,"VEGETARIAN","MAINTAIN"));
        PlanView first=generate(who,7);
        assertTrue(reports.findByDietPlan_Id(first.id()).isPresent());
        mvc.perform(get("/api/v1/diet/plans/"+first.id()+"/report").with(user(who)))
            .andExpect(status().isOk()).andExpect(jsonPath("$.metrics.baselineWeightKg").value(80))
            .andExpect(jsonPath("$.metrics.mealsDue").value(4)).andExpect(jsonPath("$.metrics.mealsLogged").value(0));
        MealView today=first.days().getFirst().meals().getFirst();
        mvc.perform(put("/api/v1/diet/plans/"+first.id()+"/meals/"+today.id()+"/intake").with(user(who))
            .contentType("application/json").content(json.writeValueAsString(new IntakeRequest(true,first.version()))))
            .andExpect(status().isOk());
        MealView future=first.days().get(1).meals().getFirst();
        mvc.perform(put("/api/v1/diet/plans/"+first.id()+"/meals/"+future.id()+"/intake").with(user(who))
            .contentType("application/json").content(json.writeValueAsString(new IntakeRequest(true,first.version()+1))))
            .andExpect(status().isUnprocessableEntity());
        mvc.perform(post("/api/v1/diet/progress").with(user(who)).contentType("application/json")
            .content(json.writeValueAsString(new WeightRequest(79.5,LocalDate.now())))).andExpect(status().isOk());
        var saved=reports.findByDietPlan_Id(first.id()).orElseThrow();
        assertEquals(1,json.readTree(saved.metricsSnapshot).path("mealsLogged").asInt());
        assertEquals(-.5,json.readTree(saved.metricsSnapshot).path("weightChangeKg").asDouble());
        PlanView second=generate(who,1);
        assertNotEquals(saved.id,reports.findByDietPlan_Id(second.id()).orElseThrow().id);
        mvc.perform(get("/api/v1/diet/plans/"+first.id()+"/report").with(user(who)))
            .andExpect(status().isOk()).andExpect(jsonPath("$.metrics.baselineWeightKg").value(80))
            .andExpect(jsonPath("$.metrics.mealLoggingPercent").value(25));
        mvc.perform(get("/api/v1/diet/plans/"+second.id()+"/report").with(user(who)))
            .andExpect(status().isOk()).andExpect(jsonPath("$.metrics.baselineWeightKg").value(79.5));
        mvc.perform(get("/api/v1/diet/plans/"+first.id()+"/report").with(user("not-the-owner"))).andExpect(status().isNotFound());
    }
    @Test @Transactional(propagation=Propagation.NOT_SUPPORTED)
    void recipesAndAlternativesSurviveSeparateHttpTransactions()throws Exception{
        String who="http-boundary-test";
        try {
            save(who,NutritionTest.profile(80,"VEGETARIAN","MAINTAIN"));PlanView p=generate(who,1);
            String body=mvc.perform(get("/api/v1/diet/plans/"+p.id()).with(user(who))).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
            PlanView reloaded=json.readValue(body,PlanView.class);MealView meal=reloaded.days().getFirst().meals().getFirst();
            assertNotNull(meal.recipeId());assertNotNull(meal.name());assertFalse(meal.name().isBlank());
            mvc.perform(get("/api/v1/diet/plans/"+p.id()+"/meals/"+meal.id()+"/alternatives").with(user(who))).andExpect(status().isOk());
            mvc.perform(post("/api/v1/diet/plans/"+p.id()+"/meals/"+meal.id()+"/foods").with(user(who)).contentType("application/json")
                .content(json.writeValueAsString(new MealFoodRequest(meal.ingredients().getFirst().foodId(),1,-1,p.version())))).andExpect(status().isOk()).andExpect(jsonPath("$.version").value(p.version()+1));
        } finally {
            new TransactionTemplate(transactions).executeWithoutResult(tx->{plans.deleteAll(plans.findTop30ByUserIdOrderByCreatedAtDesc(who));profiles.findByUserId(who).ifPresent(profiles::delete);});
        }
    }
}
