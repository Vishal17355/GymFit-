package com.gymfit.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.*;
import com.gymfit.dto.DietDtos.*;
import com.gymfit.entity.*;
import com.gymfit.exception.DietException;
import com.gymfit.integration.*;
import com.gymfit.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.*;

@Service @Transactional
public class FoodService {
    private final FoodRepository foods;
    private final FoodSearchCacheRepository cache;
    private final UsdaClient usda;
    private final UsdaNutrientMapper mapper;
    private final ObjectMapper json;
    private final int cacheDays;
    public FoodService(FoodRepository foods, FoodSearchCacheRepository cache, UsdaClient usda, UsdaNutrientMapper mapper,
                       ObjectMapper json, @Value("${usda.api.cache-days:30}") int cacheDays) {
        this.foods=foods; this.cache=cache; this.usda=usda; this.mapper=mapper; this.json=json; this.cacheDays=cacheDays;
    }
    public FoodSearch search(String query, boolean localOnly) {
        String key = query.trim().toLowerCase(Locale.ROOT);
        List<Food> local = localOnly ? foods.findByReviewedTrueOrderById().stream().filter(f -> f.name.toLowerCase(Locale.ROOT).contains(key)).toList()
            : foods.findTop30ByNameContainingIgnoreCaseOrderById(key);
        if (localOnly) return new FoodSearch(local.stream().map(FoodService::view).toList(), "Reviewed local catalog; quantities are grams in the named preparation state.");
        var saved = cache.findById(key);
        if (saved.isPresent() && saved.get().expiresAt.isAfter(Instant.now())) {
            try {
                List<Long> ids = json.readValue(saved.get().foodIds, new TypeReference<>() {});
                return combined(local, foods.findAllById(ids), "Cached USDA search. Select a specific food and preparation state; matches are not interchangeable.");
            } catch (Exception ignored) { /* A malformed search cache is refetched. */ }
        }
        try {
            JsonNode data = usda.search(query);
            if (!data.path("foods").isArray()) throw new IllegalArgumentException("Missing USDA search results");
            List<Food> imported = new ArrayList<>();
            for (JsonNode n : data.path("foods")) imported.add(upsert(n));
            FoodSearchCache entry = new FoodSearchCache(); entry.queryKey = key;
            entry.foodIds = json.writeValueAsString(imported.stream().map(f -> f.id).toList()); entry.expiresAt = Instant.now().plus(Duration.ofDays(cacheDays)); cache.save(entry);
            return combined(local, imported, "USDA search. Unreviewed foods are searchable but cannot enter automatic plans until dietary/allergen metadata is verified.");
        } catch (DietException e) {
            if (local.isEmpty()) throw e;
            return combined(local, List.of(), e.getMessage());
        } catch (Exception e) {
            if (local.isEmpty()) throw DietException.invalid("USDA returned incomplete nutrient information; no substitute was invented.");
            return combined(local, List.of(), "Saved foods shown because provider data could not be normalized.");
        }
    }
    public FoodView get(long id) { return view(foods.findById(id).orElseThrow(() -> DietException.missing("Food not found."))); }
    public FoodView importExact(long fdcId) {
        var existing = foods.findBySourceAndExternalFoodId("USDA", Long.toString(fdcId));
        if (existing.isPresent() && existing.get().lastUpdated.isAfter(Instant.now().minus(Duration.ofDays(cacheDays)))) return view(existing.get());
        return view(upsert(usda.details(fdcId)));
    }
    private Food upsert(JsonNode data) {
        Food fresh = mapper.map(data);
        var existing = foods.findBySourceAndExternalFoodId("USDA", fresh.externalFoodId);
        if (existing.isEmpty()) return foods.save(fresh);
        Food saved = existing.get();
        if (fresh.complete()) {
            saved.calories=fresh.calories; saved.protein=fresh.protein; saved.carbohydrates=fresh.carbohydrates; saved.fat=fresh.fat; saved.fiber=fresh.fiber;
            saved.originalServingQuantity=fresh.originalServingQuantity; saved.originalServingUnit=fresh.originalServingUnit; saved.lastUpdated=fresh.lastUpdated;
        }
        return foods.save(saved);
    }
    private static FoodSearch combined(List<Food> first, List<Food> second, String message) {
        Map<Long, FoodView> unique = new LinkedHashMap<>();
        first.forEach(f -> unique.put(f.id, view(f))); second.forEach(f -> unique.put(f.id, view(f)));
        return new FoodSearch(unique.values().stream().limit(30).toList(), message);
    }
    public static FoodView view(Food f) { return new FoodView(f.id,f.name,f.source,f.externalFoodId,f.calories,f.protein,f.carbohydrates,f.fat,f.fiber,
        f.servingUnit,f.servingQuantity,f.dietType,List.copyOf(f.allergens),f.reviewed,f.preparationState,f.sourceUrl); }
}
