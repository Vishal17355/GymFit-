package com.gymfit.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.gymfit.entity.Food;
import org.springframework.stereotype.Component;
import java.time.Instant;
import java.util.*;

@Component
public class UsdaNutrientMapper {
    public Food map(JsonNode data) {
        if (!data.path("fdcId").canConvertToLong() || data.path("description").asText().isBlank())
            throw new IllegalArgumentException("USDA returned an incomplete food identity");
        Food f = new Food(); f.externalFoodId = data.path("fdcId").asText(); f.name = data.path("description").asText(); f.source = "USDA";
        f.sourceUrl = "https://fdc.nal.usda.gov/food-details/" + f.externalFoodId + "/nutrients";
        f.preparationState = f.name; f.lastUpdated = Instant.now();
        // USDA foodNutrients represent amounts per 100 g; labelNutrients are per branded serving and are deliberately not mixed in.
        Map<Integer, Double> values = new HashMap<>();
        for (JsonNode n : data.path("foodNutrients")) {
            JsonNode info = n.has("nutrient") ? n.path("nutrient") : n;
            int id = info.has("id") ? info.path("id").asInt() : n.path("nutrientId").asInt();
            JsonNode amount = n.has("amount") ? n.path("amount") : n.path("value");
            if (!amount.isNumber() || !Double.isFinite(amount.asDouble()) || amount.asDouble() < 0) continue;
            String unit = info.path("unitName").asText().toLowerCase(Locale.ROOT);
            double value = amount.asDouble();
            if (Set.of(1003, 1004, 1005, 1079).contains(id)) {
                if (unit.equals("mg")) value /= 1000;
                else if (unit.equals("µg") || unit.equals("ug")) value /= 1_000_000;
                else if (!unit.equals("g")) continue;
            } else if (Set.of(1008, 2047, 2048).contains(id)) {
                if (unit.equals("kj")) value /= 4.184;
                else if (!unit.equals("kcal")) continue;
            } else if (id == 1062 && unit.equals("kj")) value /= 4.184;
            else continue;
            values.put(id, value);
        }
        f.calories = values.getOrDefault(1008, values.getOrDefault(2047, values.getOrDefault(2048, values.get(1062))));
        f.protein = values.get(1003); f.carbohydrates = values.get(1005); f.fat = values.get(1004); f.fiber = values.get(1079);
        f.originalServingQuantity = data.path("servingSize").isNumber() ? data.path("servingSize").asDouble() : null;
        f.originalServingUnit = data.path("servingSizeUnit").asText(null);
        return f;
    }
}
