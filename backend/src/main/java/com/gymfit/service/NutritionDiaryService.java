package com.gymfit.service;

import com.gymfit.exception.DietException;
import com.gymfit.recommendation.RecipeNutrition;
import com.gymfit.repository.RecipeRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.Clock;
import java.time.LocalDate;
import java.util.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NutritionDiaryService {
    public record Nutrients(@NotNull @DecimalMin("0") @DecimalMax("18000") Double calories,
                            @NotNull @DecimalMin("0") @DecimalMax("2000") Double protein,
                            @NotNull @DecimalMin("0") @DecimalMax("2000") Double carbs,
                            @NotNull @DecimalMin("0") @DecimalMax("2000") Double fat,
                            @DecimalMin("0") @DecimalMax("2000") Double fiber) {}
    public record Add(@NotNull LocalDate date, @NotBlank String mealSlot, @Positive Long foodId,
                      @Size(max=180) String name, @DecimalMin("0.1") @DecimalMax("2000") double grams,
                      @Valid Nutrients nutrients) {}
    public record Update(@NotBlank String mealSlot, @DecimalMin("0.1") @DecimalMax("20000") double grams,
                         boolean favorite) {}
    public record Repeat(@NotNull LocalDate date, @NotBlank String mealSlot) {}
    public record AddRecipe(@NotNull LocalDate date, @NotBlank String mealSlot, @Positive long recipeId,
                            @DecimalMin("0.1") @DecimalMax("10") double servings) {}
    public record RecipeChoice(long id, String name, double caloriesPerServing) {}
    public record Water(@NotNull LocalDate date, @Min(0) @Max(20000) int milliliters) {}
    public record Settings(@Min(250) @Max(12000) int waterGoalMl, @Min(1) @Max(150) Integer fiberGoalG) {}
    public record Entry(long id, LocalDate date, String mealSlot, String name, String source,
                        double grams, Nutrients nutrients, boolean favorite) {}
    public record Day(LocalDate date, List<Entry> entries, Nutrients totals, int waterMl, Settings settings,
                      int foodStreak, List<String> milestones, NutritionTargets targets, List<Trend> week) {}
    public record NutritionTargets(double calories, double protein, double carbs, double fat) {}
    public record Trend(LocalDate date, Double calories, Double protein, Double carbs, Double fat, Double fiber, Integer waterMl) {}

    private static final Set<String> SLOTS = Set.of("BREAKFAST", "LUNCH", "DINNER", "SNACK");
    private static final RowMapper<Entry> ROW = (rs, index) -> new Entry(
        rs.getLong("id"), rs.getObject("log_date", LocalDate.class), rs.getString("meal_slot"),
        rs.getString("food_name"), rs.getString("source_name"), rs.getDouble("grams"),
        new Nutrients(rs.getDouble("calories"), rs.getDouble("protein"), rs.getDouble("carbs"),
            rs.getDouble("fat"), rs.getObject("fiber", Double.class)), rs.getBoolean("favorite"));
    private final JdbcTemplate db;
    private final FoodService foods;
    private final ProfileService profiles;
    private final NutritionService nutrition;
    private final RecipeRepository recipes;
    private final RecipeNutrition recipeNutrition;
    private final Clock clock;

    public NutritionDiaryService(JdbcTemplate db, FoodService foods, ProfileService profiles,
                                 NutritionService nutrition, RecipeRepository recipes,
                                 RecipeNutrition recipeNutrition, Clock clock) {
        this.db = db;
        this.foods = foods;
        this.profiles = profiles;
        this.nutrition = nutrition;
        this.recipes = recipes;
        this.recipeNutrition = recipeNutrition;
        this.clock = clock;
    }

    public Day day(String owner, LocalDate date) {
        validDate(date);
        var entries = db.query("SELECT * FROM nutrition_diary WHERE user_id=? AND log_date=? ORDER BY id", ROW, owner, date);
        var totals = new Nutrients(entries.stream().mapToDouble(e -> e.nutrients.calories).sum(),
            entries.stream().mapToDouble(e -> e.nutrients.protein).sum(),
            entries.stream().mapToDouble(e -> e.nutrients.carbs).sum(),
            entries.stream().mapToDouble(e -> e.nutrients.fat).sum(),
            entries.stream().anyMatch(e -> e.nutrients.fiber == null) ? null
                : entries.stream().mapToDouble(e -> e.nutrients.fiber).sum());
        var water = db.query("SELECT milliliters FROM nutrition_water_logs WHERE user_id=? AND log_date=?",
            (rs, i) -> rs.getInt(1), owner, date);
        var dates = db.query("SELECT DISTINCT log_date FROM nutrition_diary WHERE user_id=? AND log_date<=? ORDER BY log_date DESC LIMIT 366",
            (rs, i) -> rs.getObject(1, LocalDate.class), owner, date);
        var cursor = dates.contains(date) ? date : date.minusDays(1);
        int streak = 0;
        for (var logged : dates) {
            if (!logged.equals(cursor)) break;
            streak++;
            cursor = cursor.minusDays(1);
        }
        var milestones = new ArrayList<String>();
        if (!dates.isEmpty()) milestones.add("First food log");
        if (dates.size() >= 7) milestones.add("Seven days logged");
        if (dates.size() >= 30) milestones.add("Thirty days logged");
        return new Day(date, entries, totals, water.isEmpty() ? 0 : water.getFirst(), settings(owner),
            streak, milestones, targets(owner), week(owner, date));
    }

    private List<Trend> week(String owner, LocalDate through) {
        LocalDate from = through.minusDays(6);
        var food = db.query("""
            SELECT log_date,SUM(calories),SUM(protein),SUM(carbs),SUM(fat),
              CASE WHEN COUNT(fiber)=COUNT(*) THEN SUM(fiber) ELSE NULL END
            FROM nutrition_diary WHERE user_id=? AND log_date BETWEEN ? AND ? GROUP BY log_date""",
            (rs, i) -> new Trend(rs.getObject(1, LocalDate.class), rs.getDouble(2), rs.getDouble(3),
                rs.getDouble(4), rs.getDouble(5), rs.getObject(6, Double.class), null), owner, from, through);
        Map<LocalDate, Integer> water = new HashMap<>();
        db.query("SELECT log_date,milliliters FROM nutrition_water_logs WHERE user_id=? AND log_date BETWEEN ? AND ?",
            rs -> { water.put(rs.getObject(1, LocalDate.class), rs.getInt(2)); }, owner, from, through);
        return from.datesUntil(through.plusDays(1)).map(date -> {
            var totals = food.stream().filter(record -> record.date.equals(date)).findFirst()
                .orElse(new Trend(date, null, null, null, null, null, null));
            return new Trend(date, totals.calories, totals.protein, totals.carbs, totals.fat, totals.fiber, water.get(date));
        }).toList();
    }

    public List<Entry> recent(String owner, boolean favorites) {
        String query = favorites
            ? "SELECT * FROM nutrition_diary WHERE user_id=? AND favorite=TRUE ORDER BY log_date DESC,id DESC LIMIT 24"
            : "SELECT * FROM nutrition_diary WHERE user_id=? ORDER BY log_date DESC,id DESC LIMIT 24";
        return db.query(query, ROW, owner);
    }

    public Day add(String owner, Add request) {
        addEntry(owner, request);
        return day(owner, request.date);
    }

    public Day batch(String owner, List<Add> requests) {
        var date = requests.getFirst().date;
        if (requests.stream().anyMatch(request -> !request.date.equals(date))) {
            throw DietException.invalid("Log described foods on the same day.");
        }
        requests.forEach(request -> addEntry(owner, request));
        return day(owner, date);
    }

    private void addEntry(String owner, Add request) {
        validDate(request.date);
        validSlot(request.mealSlot);
        Nutrients values = request.nutrients;
        String name = request.name;
        String source = "MANUAL";
        if (request.foodId != null) {
            var food = foods.get(request.foodId);
            if (food.calories() == null || food.protein() == null || food.carbohydrates() == null ||
                food.fat() == null || !"g".equals(food.servingUnit()) || food.servingQuantity() <= 0) {
                throw DietException.invalid("This catalog item does not have complete nutrition per gram.");
            }
            double factor = request.grams / food.servingQuantity();
            values = scale(new Nutrients(food.calories(), food.protein(), food.carbohydrates(), food.fat(), food.fiber()), factor);
            name = food.name();
            source = food.source();
        }
        if (name == null || name.isBlank() || values == null) {
            throw DietException.invalid("Enter a food name and its nutrition for the portion eaten.");
        }
        insert(owner, request.date, request.mealSlot, name.trim(), source, request.grams, values);
    }

    public List<RecipeChoice> recipes() {
        return recipes.findAll().stream().sorted(Comparator.comparing(recipe -> recipe.name))
            .map(recipe -> new RecipeChoice(recipe.id, recipe.name, recipeNutrition.calculate(recipe, 1, Map.of()).calories()))
            .toList();
    }

    public Day addRecipe(String owner, AddRecipe request) {
        validDate(request.date);
        validSlot(request.mealSlot);
        var recipe = recipes.findById(request.recipeId).orElseThrow(() -> DietException.missing("Recipe not found."));
        var macros = recipeNutrition.calculate(recipe, request.servings, Map.of());
        double grams = recipe.ingredients.stream().mapToDouble(i -> i.quantity).sum() / recipe.servings * request.servings;
        Double fiber = recipe.ingredients.stream().anyMatch(i -> i.food.fiber == null) ? null
            : recipe.ingredients.stream().mapToDouble(i -> i.food.fiber * i.quantity / i.food.servingQuantity).sum()
              / recipe.servings * request.servings;
        insert(owner, request.date, request.mealSlot, recipe.name, "GYMFIT_RECIPE", grams,
            new Nutrients(macros.calories(), macros.protein(), macros.carbs(), macros.fat(), fiber));
        return day(owner, request.date);
    }

    public Day edit(String owner, long id, Update request) {
        var entry = entry(owner, id);
        validSlot(request.mealSlot);
        var n = scale(entry.nutrients, request.grams / entry.grams);
        if (db.update("""
            UPDATE nutrition_diary SET meal_slot=?, grams=?, calories=?, protein=?, carbs=?, fat=?, fiber=?, favorite=?
            WHERE user_id=? AND id=?""", request.mealSlot, request.grams, n.calories, n.protein, n.carbs,
            n.fat, n.fiber, request.favorite, owner, id) == 0) entry(owner, id);
        return day(owner, entry.date);
    }

    public Day remove(String owner, long id) {
        var entry = entry(owner, id);
        db.update("DELETE FROM nutrition_diary WHERE user_id=? AND id=?", owner, id);
        return day(owner, entry.date);
    }

    public Day repeat(String owner, long id, Repeat request) {
        var entry = entry(owner, id);
        validDate(request.date);
        validSlot(request.mealSlot);
        insert(owner, request.date, request.mealSlot, entry.name, entry.source, entry.grams, entry.nutrients);
        return day(owner, request.date);
    }

    public Day copyMeal(String owner, Repeat request, List<Entry> entries) {
        validDate(request.date);
        validSlot(request.mealSlot);
        for (Entry entry : entries) {
            insert(owner, request.date, request.mealSlot, entry.name, entry.source, entry.grams, entry.nutrients);
        }
        return day(owner, request.date);
    }

    public Day water(String owner, Water request) {
        validDate(request.date);
        db.update("""
            INSERT INTO nutrition_water_logs (user_id, log_date, milliliters) VALUES (?,?,?)
            ON DUPLICATE KEY UPDATE milliliters=?""", owner, request.date, request.milliliters, request.milliliters);
        return day(owner, request.date);
    }

    public Settings settings(String owner) {
        return db.query("SELECT water_goal_ml,fiber_goal_g FROM nutrition_diary_settings WHERE user_id=?",
            (rs, i) -> new Settings(rs.getInt(1), rs.getObject(2, Integer.class)), owner)
            .stream().findFirst().orElse(new Settings(2000, null));
    }

    public Settings settings(String owner, Settings request) {
        db.update("""
            INSERT INTO nutrition_diary_settings (user_id,water_goal_ml,fiber_goal_g) VALUES (?,?,?)
            ON DUPLICATE KEY UPDATE water_goal_ml=?,fiber_goal_g=?""",
            owner, request.waterGoalMl, request.fiberGoalG, request.waterGoalMl, request.fiberGoalG);
        return request;
    }

    private NutritionTargets targets(String owner) {
        var profile = profiles.find(owner);
        if (profile.isEmpty()) return null;
        try {
            var t = nutrition.calculate(profile.get());
            return new NutritionTargets(t.calories(), t.protein(), t.carbs(), t.fat());
        } catch (DietException unavailable) {
            return null;
        }
    }

    private Entry entry(String owner, long id) {
        return db.query("SELECT * FROM nutrition_diary WHERE user_id=? AND id=?", ROW, owner, id)
            .stream().findFirst().orElseThrow(() -> DietException.missing("Diary entry not found."));
    }

    private void insert(String owner, LocalDate date, String slot, String name, String source, double grams, Nutrients n) {
        db.update("""
            INSERT INTO nutrition_diary (user_id,log_date,meal_slot,food_name,source_name,grams,calories,protein,carbs,fat,fiber)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)""", owner, date, slot, name, source, grams, n.calories, n.protein, n.carbs, n.fat, n.fiber);
    }

    private static Nutrients scale(Nutrients n, double factor) {
        return new Nutrients(n.calories * factor, n.protein * factor, n.carbs * factor, n.fat * factor,
            n.fiber == null ? null : n.fiber * factor);
    }

    private void validDate(LocalDate date) {
        if (date.isAfter(LocalDate.now(clock)) || date.isBefore(LocalDate.of(1900, 1, 1))) {
            throw DietException.invalid("Choose today or an earlier date.");
        }
    }

    private static void validSlot(String slot) {
        if (!SLOTS.contains(slot)) throw DietException.invalid("Choose a valid meal.");
    }
}
