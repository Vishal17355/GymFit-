package com.gymfit.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gymfit.dto.DietDtos.*;
import com.gymfit.entity.*;
import com.gymfit.exception.DietException;
import com.gymfit.recommendation.*;
import com.gymfit.recommendation.RecipeNutrition.Macros;
import com.gymfit.repository.*;
import org.slf4j.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.hibernate.Hibernate;
import java.time.*;
import java.util.*;
import static com.gymfit.service.NutritionService.round;

@Service @Transactional
public class DietPlanService {
    private static final Logger LOG = LoggerFactory.getLogger(DietPlanService.class);
    private final ProfileService profiles;
    private final NutritionService nutrition;
    private final MealRecommendationEngine engine;
    private final RecipeNutrition recipeNutrition;
    private final RecipeRepository recipes;
    private final DietPlanRepository plans;
    private final WeightProgressRepository weights;
    private final FoodRepository foods;
    private final ObjectMapper json;
    private final DietProgressReportService progressReports;
    public DietPlanService(ProfileService profiles, NutritionService nutrition, MealRecommendationEngine engine,
            RecipeNutrition recipeNutrition, RecipeRepository recipes, DietPlanRepository plans, WeightProgressRepository weights, ObjectMapper json, FoodRepository foods, DietProgressReportService progressReports) {
        this.profiles=profiles; this.nutrition=nutrition; this.engine=engine; this.recipeNutrition=recipeNutrition; this.recipes=recipes; this.plans=plans; this.weights=weights; this.json=json;
        this.foods=foods;
        this.progressReports=progressReports;
    }
    public PlanView generate(String user, GenerateRequest request) {
        ProfileRequest p = profiles.get(user);
        Nutrition target = nutrition.calculate(p);
        List<Recipe> catalog = recipes.findAllByOrderById();
        DietPlan plan = new DietPlan(); plan.userId=user; plan.startDate=request.startDate(); plan.endDate=request.startDate().plusDays(request.days()-1);
        plan.targetCalories=target.calories(); plan.targetProtein=target.protein(); plan.targetCarbs=target.carbs(); plan.targetFat=target.fat();
        plan.bmr=target.bmr(); plan.tdee=target.tdee(); plan.activityFactor=target.activityFactor(); plan.status="GENERATED"; plan.profileSnapshot=write(p);
        Map<Long,Integer> usage = new HashMap<>();
        for (int day=0; day<request.days(); day++) {
            List<MealRecommendationEngine.Choice> choices = engine.generateDay(catalog,p,target,usage);
            for (var c : choices) {
                DietPlanMeal meal = new DietPlanMeal(); meal.dietPlan=plan; meal.mealDate=request.startDate().plusDays(day); meal.mealType=c.recipe().mealCategory;
                apply(meal,c.recipe(),c.multiplier(),p); plan.meals.add(meal); usage.merge(c.recipe().id,1,Integer::sum);
            }
        }
        plans.saveAndFlush(plan);
        progressReports.createForGeneratedPlan(plan);
        LOG.info("Generated diet plan {} with {} days", plan.id, request.days());
        return view(plan);
    }
    public List<PlanView> list(String user) { return plans.findTop30ByUserIdOrderByCreatedAtDesc(user).stream().map(this::view).toList(); }
    public PlanView get(String user, long id) { return view(owned(user,id)); }
    public List<AlternativeView> alternatives(String user,long planId,long mealId) {
        DietPlan plan=owned(user,planId); DietPlanMeal meal=meal(plan,mealId); ProfileRequest p=currentProfile(plan);
        Macros other=otherMeals(plan,meal); Nutrition target=targets(plan);
        return engine.candidates(meal.mealType,recipes.findAllByOrderById(),p).stream()
            .filter(c -> (meal.customized || !c.recipe().id.equals(recipeOf(meal).id)) && MealRecommendationEngine.valid(other.plus(c.macros()),target,p.dailyBudget()))
            .sorted(Comparator.comparingDouble((MealRecommendationEngine.Choice c) -> MealRecommendationEngine.score(other.plus(c.macros()),target,1))
                .thenComparing(c -> c.recipe().id).thenComparingDouble(MealRecommendationEngine.Choice::multiplier))
            .limit(8).map(c -> new AlternativeView(c.recipe().id,c.recipe().name,c.multiplier(),round(c.macros().calories()),round(c.macros().protein()),
                round(c.macros().carbs()),round(c.macros().fat()),c.macros().cost()==null?null:round(c.macros().cost()))).toList();
    }
    public PlanView replace(String user,ReplaceRequest request) {
        DietPlan plan=owned(user,request.planId()); checkVersion(plan,request.version());
        ProfileRequest p=currentProfile(plan); DietPlanMeal meal=meal(plan,request.mealId());
        Recipe r=recipes.findAllByOrderById().stream().filter(x->x.id.equals(request.recipeId())).findFirst().orElseThrow(()->DietException.missing("Recipe not found."));
        boolean available=engine.candidates(meal.mealType,List.of(r),p).stream().anyMatch(c->Double.compare(c.multiplier(),request.servingMultiplier())==0);
        Macros replacement=available?recipeNutrition.calculate(r,request.servingMultiplier(),p.pricesPer100g()):null;
        if (!available || !MealRecommendationEngine.valid(otherMeals(plan,meal).plus(replacement),targets(plan),p.dailyBudget()))
            throw DietException.invalid("This replacement does not satisfy the saved plan's dietary, budget and daily nutrition requirements.");
        apply(meal,r,request.servingMultiplier(),p); meal.eaten=false; plan.updatedAt=Instant.now(); plans.saveAndFlush(plan); progressReports.refresh(plan); return view(plan);
    }
    public PlanView intake(String user,long planId,long mealId,IntakeRequest request) {
        DietPlan plan=owned(user,planId); checkVersion(plan,request.version()); DietPlanMeal targetMeal=meal(plan,mealId);
        if(request.eaten() && targetMeal.mealDate.isAfter(progressReports.today()))
            throw DietException.invalid("Future meals are scheduled, not recorded intake. Mark this meal eaten on its date.");
        targetMeal.eaten=request.eaten();
        plan.updatedAt=Instant.now(); plans.saveAndFlush(plan); progressReports.refresh(plan); return view(plan);
    }
    public PlanView editFood(String user,long planId,long mealId,MealFoodRequest request) {
        DietPlan plan=owned(user,planId);checkVersion(plan,request.version());ProfileRequest p=currentProfile(plan);DietPlanMeal meal=meal(plan,mealId);
        Food f=foods.findById(request.foodId()).orElseThrow(()->DietException.missing("Food not found."));
        Recipe check=new Recipe();RecipeIngredient ingredient=new RecipeIngredient();ingredient.food=f;check.ingredients.add(ingredient);
        if(!recipeNutrition.eligible(check,p)||!"g".equals(f.servingUnit))throw DietException.invalid("This food is unreviewed or incompatible with your diet, allergies or availability.");
        List<IngredientView> items;
        try {items=new ArrayList<>(json.readValue(meal.ingredientSnapshot,new TypeReference<List<IngredientView>>(){}));}
        catch(Exception e){throw new IllegalStateException("Invalid meal snapshot",e);}
        double factor=request.quantity()/f.servingQuantity;
        IngredientView item=new IngredientView(f.id,f.name,request.quantity(),"g",f.calories*factor,f.protein*factor,f.carbohydrates*factor,f.fat*factor,f.sourceUrl);
        if(request.ingredientIndex()==-1)items.add(item);
        else if(request.ingredientIndex()<items.size())items.set(request.ingredientIndex(),item);
        else throw DietException.invalid("That ingredient is no longer in the meal. Reload and try again.");
        if(items.stream().mapToDouble(IngredientView::quantity).sum()>1100)throw DietException.invalid("The resulting serving is too large for this planner.");
        Macros total=Macros.zero();
        for(var i:items){Double price=p.pricesPer100g().get(i.foodId());total=total.plus(new Macros(i.calories(),i.protein(),i.carbs(),i.fat(),price==null?null:price*i.quantity()/100));}
        if(!MealRecommendationEngine.valid(otherMeals(plan,meal).plus(total),targets(plan),p.dailyBudget()))
            throw DietException.invalid("This food edit would move daily calories or macronutrients outside the plan's limits, or exceed its budget. Try a smaller quantity or replace the meal.");
        meal.totalCalories=total.calories();meal.totalProtein=total.protein();meal.totalCarbs=total.carbs();meal.totalFat=total.fat();meal.estimatedCost=total.cost();
        meal.ingredientSnapshot=write(items);meal.customized=true;meal.eaten=false;plan.updatedAt=Instant.now();plans.saveAndFlush(plan);progressReports.refresh(plan);return view(plan);
    }
    public WeightView recordWeight(String user,WeightRequest request) {
        profiles.entity(user);
        WeightProgress w=weights.findByUserIdAndRecordedAt(user,request.recordedAt()).orElseGet(WeightProgress::new);
        w.userId=user; w.weight=request.weight(); w.recordedAt=request.recordedAt(); weights.saveAndFlush(w); progressReports.refreshForWeight(user,w.recordedAt); return new WeightView(w.id,w.weight,w.recordedAt);
    }
    public List<WeightView> weights(String user) { return weights.findByUserIdOrderByRecordedAt(user).stream().map(w->new WeightView(w.id,w.weight,w.recordedAt)).toList(); }
    private void apply(DietPlanMeal m,Recipe r,double multiplier,ProfileRequest p) {
        Macros n=recipeNutrition.calculate(r,multiplier,p.pricesPer100g()); m.recipe=r; m.servingMultiplier=multiplier;
        m.totalCalories=n.calories(); m.totalProtein=n.protein(); m.totalCarbs=n.carbs(); m.totalFat=n.fat(); m.estimatedCost=n.cost();
        m.ingredientSnapshot=write(recipeNutrition.ingredients(r,multiplier));
        m.customized=false;
    }
    private ProfileRequest currentProfile(DietPlan plan) {
        ProfileRequest p=profiles.get(plan.userId);
        if (!json.valueToTree(p).equals(json.valueToTree(readProfile(plan.profileSnapshot))))
            throw DietException.invalid("Your profile or ingredient prices changed. Generate a new plan before replacing meals.");
        return p;
    }
    private Macros otherMeals(DietPlan p,DietPlanMeal excluded) {
        return p.meals.stream().filter(m->m!=excluded&&m.mealDate.equals(excluded.mealDate)).map(m->new Macros(m.totalCalories,m.totalProtein,m.totalCarbs,m.totalFat,m.estimatedCost)).reduce(Macros.zero(),Macros::plus);
    }
    private DietPlan owned(String user,long id) { return plans.findByIdAndUserId(id,user).orElseThrow(()->DietException.missing("Diet plan not found.")); }
    private Recipe recipeOf(DietPlanMeal meal) { return Hibernate.unproxy(meal.recipe,Recipe.class); }
    private DietPlanMeal meal(DietPlan plan,long id) { return plan.meals.stream().filter(m->m.id==id).findFirst().orElseThrow(()->DietException.missing("Meal not found in this plan.")); }
    private void checkVersion(DietPlan plan,long version) {
        if (plan.version!=version) throw new DietException(HttpStatus.CONFLICT,"CONFLICT","This plan changed. Reload before editing.");
    }
    private Nutrition targets(DietPlan p) { return new Nutrition(p.bmr,p.tdee,p.activityFactor,p.targetCalories,p.targetProtein,p.targetCarbs,p.targetFat,
        "Nutrition and energy estimates for generally healthy adults. Review quantities, preparation state and allergies."); }
    private PlanView view(DietPlan plan) {
        Map<LocalDate,List<MealView>> byDay=new TreeMap<>();
        for (DietPlanMeal m:plan.meals) {
            List<IngredientView> ingredients;
            try { ingredients=json.readValue(m.ingredientSnapshot,new TypeReference<>(){}); }
            catch (Exception e) { throw new IllegalStateException("Invalid saved meal snapshot",e); }
            Recipe recipe=recipeOf(m);
            byDay.computeIfAbsent(m.mealDate,key->new ArrayList<>()).add(new MealView(m.id,recipe.id,m.mealType,recipe.name,recipe.instructions,m.servingMultiplier,
                round(m.totalCalories),round(m.totalProtein),round(m.totalCarbs),round(m.totalFat),m.estimatedCost==null?null:round(m.estimatedCost),m.eaten,m.customized,ingredients));
        }
        List<DayView> days=byDay.entrySet().stream().map(e->{
            var meals=e.getValue(); meals.sort(Comparator.comparingInt(m->MealRecommendationEngine.SLOTS.indexOf(m.mealType())));
            double calories=0,protein=0,carbs=0,fat=0,consumedCalories=0,consumedProtein=0; Double cost=0.0; int eaten=0;
            for(var m:meals) { calories+=m.calories(); protein+=m.protein(); carbs+=m.carbs(); fat+=m.fat(); cost=cost==null||m.estimatedCost()==null?null:cost+m.estimatedCost();
                if(m.eaten()){eaten++;consumedCalories+=m.calories();consumedProtein+=m.protein();} }
            return new DayView(e.getKey(),List.copyOf(meals),new Totals(round(calories),round(protein),round(carbs),round(fat),cost==null?null:round(cost),round(consumedCalories),round(consumedProtein),eaten,meals.size()));
        }).toList();
        return new PlanView(plan.id,plan.version,plan.status,plan.createdAt,readProfile(plan.profileSnapshot),targets(plan),days);
    }
    private String write(Object object) { try { return json.writeValueAsString(object); } catch(Exception e) { throw new IllegalStateException("Cannot save plan snapshot",e); } }
    private ProfileRequest readProfile(String data) { try { return json.readValue(data,ProfileRequest.class); } catch(Exception e) { throw new IllegalStateException("Invalid saved profile snapshot",e); } }
}
