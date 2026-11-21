package com.gymfit;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Clock;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test")
class NutritionDiaryIntegrationTest {
    private static final String ROOT = "/api/v1/nutrition-diary";
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired Clock clock;

    @DynamicPropertySource static void database(DynamicPropertyRegistry properties) {
        String url = System.getenv("GYMFIT_TEST_DB_URL");
        if (url == null) return;
        properties.add("spring.datasource.url", () -> url);
        properties.add("spring.datasource.username", () -> System.getenv("GYMFIT_TEST_DB_USERNAME"));
        properties.add("spring.datasource.password", () -> System.getenv().getOrDefault("GYMFIT_TEST_DB_PASSWORD", ""));
    }

    @Test void diaryPersistsWithoutDietProfileAndProtectsEntryOwnership() throws Exception {
        var today = LocalDate.now(clock).toString();
        var owner = "diary-" + UUID.randomUUID();
        var other = "diary-" + UUID.randomUUID();
        assertTrue(call(get(ROOT).param("date", today), owner, null, 200).path("targets").isNull());
        var saved = call(post(ROOT + "/entries"), owner, Map.of("date", today, "mealSlot", "LUNCH",
            "name", "Test lunch", "grams", 100, "nutrients", Map.of("calories", 200, "protein", 10, "carbs", 25, "fat", 6)), 200);
        long id = saved.path("entries").get(0).path("id").asLong();
        assertTrue(saved.path("totals").path("fiber").isNull());
        var edited = call(patch(ROOT + "/entries/" + id), owner,
            Map.of("mealSlot", "DINNER", "grams", 150, "favorite", true), 200);
        assertEquals(300, edited.path("totals").path("calories").asDouble());
        assertEquals(1, call(get(ROOT + "/recent").param("favorites", "true"), owner, null, 200).size());
        var repeat = Map.of("date", today, "mealSlot", "SNACK");
        call(post(ROOT + "/entries/" + id + "/repeat"), other, repeat, 404);
        call(delete(ROOT + "/entries/" + id), other, null, 404);
        call(post(ROOT + "/entries/" + id + "/repeat"), owner, repeat, 200);
        var reloaded = call(get(ROOT).param("date", today), owner, null, 200);
        assertEquals(600, reloaded.path("totals").path("calories").asDouble());
        assertEquals(7, reloaded.path("week").size());
        assertTrue(reloaded.path("week").get(0).path("calories").isNull());
        assertEquals(600, reloaded.path("week").get(6).path("calories").asDouble());
        assertEquals(1, reloaded.path("foodStreak").asInt());
        assertEquals(0, call(get(ROOT).param("date", today), other, null, 200).path("entries").size());
        assertEquals(1, call(delete(ROOT + "/entries/" + id), owner, null, 200).path("entries").size());
    }

    @Test void recipesWaterAndGoalsUseServerValues() throws Exception {
        var today = LocalDate.now(clock).toString();
        var owner = "diary-" + UUID.randomUUID();
        var recipes = call(get(ROOT + "/recipes"), owner, null, 200);
        assertEquals(30, recipes.size());
        var recipe = recipes.get(0);
        var logged = call(post(ROOT + "/entries/recipe"), owner, Map.of("date", today, "mealSlot", "BREAKFAST",
            "recipeId", recipe.path("id").asLong(), "servings", 2), 200);
        assertEquals(recipe.path("caloriesPerServing").asDouble() * 2, logged.path("totals").path("calories").asDouble(), 0.01);
        call(put(ROOT + "/settings"), owner, Map.of("waterGoalMl", 1800, "fiberGoalG", 25), 200);
        call(put(ROOT + "/settings"), owner, Map.of("waterGoalMl", 2000, "fiberGoalG", 26), 200);
        call(put(ROOT + "/water"), owner, Map.of("date", today, "milliliters", 250), 200);
        var water = call(put(ROOT + "/water"), owner, Map.of("date", today, "milliliters", 500), 200);
        assertEquals(500, water.path("waterMl").asInt());
        assertEquals(26, water.path("settings").path("fiberGoalG").asInt());
        call(get(ROOT).param("date", LocalDate.now(clock).plusDays(1).toString()), owner, null, 422);
    }

    private JsonNode call(MockHttpServletRequestBuilder request, String owner, Object body, int statusCode) throws Exception {
        if (body != null) request.contentType("application/json").content(json.writeValueAsString(body));
        var response = mvc.perform(request.with(user(owner))).andExpect(status().is(statusCode)).andReturn().getResponse();
        return json.readTree(response.getContentAsString());
    }
}
