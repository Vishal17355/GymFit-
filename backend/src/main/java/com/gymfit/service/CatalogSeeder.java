package com.gymfit.service;

import com.fasterxml.jackson.databind.*;
import com.gymfit.entity.*;
import com.gymfit.repository.*;
import org.slf4j.*;
import org.springframework.boot.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.*;

@Component
public class CatalogSeeder implements ApplicationRunner {
    private final FoodRepository foods;
    private final RecipeRepository recipes;
    private final ObjectMapper json;
    public CatalogSeeder(FoodRepository foods, RecipeRepository recipes, ObjectMapper json) { this.foods = foods; this.recipes = recipes; this.json = json; }
    @Override @Transactional public void run(ApplicationArguments args) throws Exception {
        Map<String, Food> keyed = new HashMap<>();
        try (var stream = new ClassPathResource("catalog/foods.json").getInputStream()) {
            for (JsonNode n : json.readTree(stream)) {
                Food f = foods.findBySourceAndExternalFoodId(n.path("source").asText(), n.path("externalFoodId").asText()).orElse(null);
                if (f == null) {
                    f = new Food(); f.name = n.path("name").asText(); f.source = n.path("source").asText(); f.externalFoodId = n.path("externalFoodId").asText();
                    f.calories = n.path("calories").asDouble(); f.protein = n.path("protein").asDouble(); f.carbohydrates = n.path("carbohydrates").asDouble(); f.fat = n.path("fat").asDouble();
                    f.fiber = n.path("fiber").isNumber() ? n.path("fiber").asDouble() : null;
                    f.dietType = n.path("dietType").asText(); f.preparationState = n.path("preparationState").asText(); f.sourceUrl = n.path("sourceUrl").asText();
                    f.allergens = new ArrayList<>(); for (JsonNode a : n.path("allergens")) f.allergens.add(a.asText());
                    f.reviewed = true; f.lastUpdated = Instant.now(); f = foods.save(f);
                }
                keyed.put(n.path("key").asText(), f);
            }
        }
        if (recipes.count() == 0) try (var stream = new ClassPathResource("catalog/recipes.json").getInputStream()) {
            for (JsonNode n : json.readTree(stream)) {
                Recipe r = new Recipe(); r.name = n.path("name").asText(); r.instructions = n.path("instructions").asText();
                r.mealCategory = n.path("mealCategory").asText(); r.dietaryType = n.path("dietaryType").asText(); r.preparationTime = n.path("preparationTime").asInt(); r.servings = n.path("servings").asDouble(); r.source = "GYMFIT_LOCAL";
                for (JsonNode ing : n.path("ingredients")) {
                    RecipeIngredient i = new RecipeIngredient(); i.recipe = r; i.food = Objects.requireNonNull(keyed.get(ing.path("food").asText()));
                    i.quantity = ing.path("quantity").asDouble(); r.ingredients.add(i);
                }
                recipes.save(r);
            }
        }
        LoggerFactory.getLogger(CatalogSeeder.class).info("Local catalog ready: {} foods, {} recipes", foods.count(), recipes.count());
    }
}
