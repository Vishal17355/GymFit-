package com.gymfit.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.gymfit.exception.DietException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.*;
import java.net.http.HttpClient;
import java.time.*;
import java.util.*;
import java.util.function.Supplier;

@Component
public class UsdaClient {
    private final RestClient client;
    private final String key;
    private final long minInterval;
    private long nextRequest;
    public UsdaClient(RestClient.Builder builder, @Value("${usda.api.base-url}") String base,
                      @Value("${usda.api.key:}") String key, @Value("${usda.api.min-request-interval-ms:1000}") long interval) {
        var factory = new JdkClientHttpRequestFactory(HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(4)).build());
        factory.setReadTimeout(Duration.ofSeconds(6));
        this.client = builder.baseUrl(base).requestFactory(factory).build(); this.key = key; this.minInterval = interval;
    }
    public boolean configured() { return !key.isBlank(); }
    public JsonNode search(String query) {
        return call(() -> client.post().uri(u -> u.path("/foods/search").queryParam("api_key", key).build())
            .contentType(MediaType.APPLICATION_JSON).body(Map.of("query", query, "pageSize", 10,
                "dataType", List.of("Foundation", "SR Legacy", "Branded"))).retrieve().body(JsonNode.class));
    }
    public JsonNode details(long id) {
        return call(() -> client.get().uri(u -> u.path("/food/{id}").queryParam("api_key", key).build(id)).retrieve().body(JsonNode.class));
    }
    private JsonNode call(Supplier<JsonNode> request) {
        synchronized (this) {
            long now = System.currentTimeMillis();
            if (!configured()) throw unavailable("USDA_API_KEY is not configured; saved foods remain available.");
            if (now < nextRequest) throw unavailable("Nutrition provider cooldown is active; use saved foods or try again later.");
            nextRequest = now + minInterval;
        }
        try {
            JsonNode response = request.get();
            if (response == null) throw unavailable("Nutrition provider returned no food data.");
            return response;
        } catch (RestClientResponseException e) {
            long cooldown = 5000;
            if (e.getStatusCode().value() == 429) {
                cooldown = 60_000;
                try { cooldown = Math.max(cooldown, Long.parseLong(e.getResponseHeaders().getFirst("Retry-After")) * 1000); }
                catch (Exception ignored) { /* Some providers omit Retry-After. */ }
            }
            synchronized (this) { nextRequest = Math.max(nextRequest, System.currentTimeMillis() + Math.min(cooldown, 3_600_000)); }
            throw unavailable("Nutrition provider unavailable (HTTP " + e.getStatusCode().value() + "). Saved foods remain available.");
        } catch (RestClientException e) {
            synchronized (this) { nextRequest = System.currentTimeMillis() + 5000; }
            throw unavailable("Nutrition provider timed out or returned invalid data. Saved foods remain available.");
        }
    }
    private static DietException unavailable(String message) { return new DietException(HttpStatus.SERVICE_UNAVAILABLE, "NUTRITION_SOURCE_UNAVAILABLE", message); }
}
