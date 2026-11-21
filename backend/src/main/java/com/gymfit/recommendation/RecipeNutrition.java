package com.gymfit.recommendation;

import com.gymfit.entity.*;
import com.gymfit.dto.DietDtos.*;
import com.gymfit.exception.DietException;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class RecipeNutrition {
    public record Macros(double calories, double protein, double carbs, double fat, Double cost) {
        public Macros plus(Macros other) { return new Macros(calories + other.calories, protein + other.protein, carbs + other.carbs, fat + other.fat,
            cost == null || other.cost == null ? null : cost + other.cost); }
        public Macros scale(double n) { return new Macros(calories*n, protein*n, carbs*n, fat*n, cost == null ? null : cost*n); }
        public static Macros zero() { return new Macros(0,0,0,0,0.0); }
    }
    public Macros calculate(Recipe recipe, double multiplier, Map<Long, Double> prices) {
        Macros total = Macros.zero();
        if (recipe.ingredients.isEmpty() || recipe.servings <= 0 || multiplier <= 0) throw DietException.invalid("Recipe quantities are incomplete.");
        for (RecipeIngredient i : recipe.ingredients) {
            Food f = i.food;
            if (!f.reviewed || !f.complete() || !i.unit.equals(f.servingUnit))
                throw DietException.invalid("Recipe includes unverified nutrition or incompatible quantity units: " + f.name);
            double factor = i.quantity / f.servingQuantity / recipe.servings * multiplier;
            Double cost = prices.containsKey(f.id) ? prices.get(f.id) * i.quantity / 100 / recipe.servings * multiplier : null;
            total = total.plus(new Macros(f.calories*factor, f.protein*factor, f.carbohydrates*factor, f.fat*factor, cost));
        }
        return total;
    }
    public List<IngredientView> ingredients(Recipe r, double multiplier) {
        return r.ingredients.stream().map(i -> {
            double factor = i.quantity / i.food.servingQuantity / r.servings * multiplier;
            return new IngredientView(i.food.id, i.food.name, i.quantity / r.servings * multiplier, i.unit,
                i.food.calories*factor, i.food.protein*factor, i.food.carbohydrates*factor, i.food.fat*factor, i.food.sourceUrl);
        }).toList();
    }
    public boolean eligible(Recipe r, ProfileRequest p) {
        if (r.ingredients.isEmpty()) return false;
        for (RecipeIngredient i : r.ingredients) {
            Food f = i.food;
            if (!f.reviewed || !f.complete()) return false;
            boolean allowedDiet = switch (p.dietaryPreference()) {
                case "VEGAN" -> f.dietType.equals("VEGAN");
                case "VEGETARIAN" -> Set.of("VEGAN", "VEGETARIAN").contains(f.dietType);
                case "EGGETARIAN" -> !f.dietType.equals("NON_VEGETARIAN") && !f.dietType.equals("UNCLASSIFIED");
                default -> !f.dietType.equals("UNCLASSIFIED");
            };
            if (!allowedDiet) return false;
            String name = f.name.toLowerCase(Locale.ROOT);
            for (String allergy : p.allergies()) {
                String a = allergy.toLowerCase(Locale.ROOT).trim();
                if (f.allergens.stream().anyMatch(tag -> tag.equalsIgnoreCase(a)) || name.contains(a)) return false;
            }
            if (p.excludedFoods().stream().anyMatch(term -> name.contains(term.toLowerCase(Locale.ROOT)))) return false;
            if (!p.availableFoods().isEmpty() && p.availableFoods().stream().noneMatch(term -> name.contains(term.toLowerCase(Locale.ROOT)))) return false;
        }
        return true;
    }
}
