package com.gymfit.recommendation;

import com.gymfit.dto.DietDtos.*;
import com.gymfit.entity.Recipe;
import com.gymfit.exception.DietException;
import com.gymfit.recommendation.RecipeNutrition.Macros;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class MealRecommendationEngine {
    public static final List<String> SLOTS = List.of("BREAKFAST", "LUNCH", "SNACK", "DINNER");
    public record Choice(Recipe recipe, double multiplier, Macros macros) {}
    private record State(List<Choice> choices, Macros totals, double penalty) {}
    private final RecipeNutrition nutrition;
    public MealRecommendationEngine(RecipeNutrition nutrition) { this.nutrition = nutrition; }
    public List<Choice> candidates(String slot, List<Recipe> recipes, ProfileRequest p) {
        List<Choice> options = new ArrayList<>();
        for (Recipe r : recipes) {
            if (!r.mealCategory.equals(slot) || !nutrition.eligible(r, p)) continue;
            for (int quarter = 2; quarter <= 10; quarter++) {
                double servings = quarter / 4.0;
                if (r.ingredients.stream().mapToDouble(i -> i.quantity / r.servings * servings).sum() > 1100) continue;
                Macros m = nutrition.calculate(r, servings, p.pricesPer100g());
                if (p.dailyBudget() != null && (m.cost() == null || m.cost() > p.dailyBudget())) continue;
                options.add(new Choice(r, servings, m));
            }
        }
        return options;
    }
    public List<Choice> generateDay(List<Recipe> recipes, ProfileRequest profile, Nutrition target, Map<Long, Integer> usage) {
        List<State> beam = List.of(new State(List.of(), Macros.zero(), 0));
        double[] fractions = {.25, .60, .75, 1};
        for (int slot = 0; slot < SLOTS.size(); slot++) {
            var options = candidates(SLOTS.get(slot), recipes, profile);
            if (options.isEmpty()) throw DietException.invalid("No eligible " + SLOTS.get(slot).toLowerCase() + " recipes. Check allergies, availability, and ingredient prices if a budget is set.");
            List<State> next = new ArrayList<>();
            for (State state : beam) for (Choice option : options) {
                Macros totals = state.totals.plus(option.macros);
                if (profile.dailyBudget() != null && totals.cost() > profile.dailyBudget()) continue;
                List<Choice> choices = new ArrayList<>(state.choices); choices.add(option);
                next.add(new State(choices, totals, state.penalty + usage.getOrDefault(option.recipe.id, 0) * .015));
            }
            double fraction = fractions[slot];
            next.sort(Comparator.comparingDouble((State s) -> score(s.totals, target, fraction) + s.penalty)
                .thenComparing(s -> s.choices.stream().map(c -> c.recipe.id + ":" + c.multiplier).reduce("", (a,b) -> a + ";" + b)));
            beam = next.stream().limit(160).toList();
        }
        return beam.stream().filter(s -> valid(s.totals, target, profile.dailyBudget()))
            .min(Comparator.comparingDouble(s -> score(s.totals, target, 1) + s.penalty)).map(State::choices)
            .orElseThrow(() -> DietException.invalid("Available recipes cannot meet calories (±10%), protein (90–125%), carbohydrate (±25%), fat (±30%) and your budget together. Add suitable verified recipes/foods or review restrictions and prices."));
    }
    public static boolean valid(Macros m, Nutrition t, Double budget) {
        return within(m.calories(), t.calories(), .90, 1.10) && within(m.protein(), t.protein(), .90, 1.25)
            && within(m.carbs(), t.carbs(), .75, 1.25) && within(m.fat(), t.fat(), .70, 1.30)
            && (budget == null || (m.cost() != null && m.cost() <= budget));
    }
    private static boolean within(double actual, double target, double lo, double hi) { return actual >= target*lo && actual <= target*hi; }
    public static double score(Macros m, Nutrition t, double fraction) {
        return 4*square(m.calories()/t.calories()-fraction) + 6*square(m.protein()/t.protein()-fraction)
            + 2*square(m.carbs()/t.carbs()-fraction) + 2*square(m.fat()/t.fat()-fraction);
    }
    private static double square(double n) { return n*n; }
}
