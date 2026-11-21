package com.gymfit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gymfit.integration.*;
import com.gymfit.exception.DietException;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicInteger;
import static org.junit.jupiter.api.Assertions.*;

class UsdaTest {
    final ObjectMapper json=new ObjectMapper();
    @Test void fullAndSearchNutrientsNormalizeUnitsWithoutUsingServingLabels() throws Exception {
        var f=new UsdaNutrientMapper().map(json.readTree("""
            {"fdcId":123,"description":"Synthetic normalization fixture", "servingSize":30,"servingSizeUnit":"ml",
             "foodNutrients":[{"nutrient":{"id":1008,"unitName":"kJ"},"amount":418.4},
             {"nutrientId":1003,"unitName":"MG","value":10000},
             {"nutrientId":1004,"unitName":"G","value":2}, {"nutrientId":1005,"unitName":"G","value":5}],
             "labelNutrients":{"calories":{"value":999}}}
            """));
        assertEquals(100,f.calories,.001);assertEquals(10,f.protein);assertNull(f.fiber);assertEquals(100,f.servingQuantity);assertEquals("g",f.servingUnit);assertFalse(f.reviewed);
    }
    @Test void missingNutrientsAreNotFabricated() throws Exception {
        var f=new UsdaNutrientMapper().map(json.readTree("{\"fdcId\":1,\"description\":\"Incomplete fixture\",\"foodNutrients\":[]}"));assertNull(f.protein);assertFalse(f.complete());
    }
    @Test void rateLimitTriggersCooldownAndDoesNotRetry() throws Exception {
        var server=HttpServer.create(new InetSocketAddress("127.0.0.1",0),0);AtomicInteger count=new AtomicInteger();
        server.createContext("/foods/search",exchange->{count.incrementAndGet();exchange.getResponseHeaders().add("Retry-After","60");exchange.sendResponseHeaders(429,-1);exchange.close();});server.start();
        try {
            var client=new UsdaClient(RestClient.builder(),"http://127.0.0.1:"+server.getAddress().getPort(),"test-only-key",0);
            assertThrows(DietException.class,()->client.search("banana"));assertThrows(DietException.class,()->client.search("banana"));assertEquals(1,count.get());
        } finally {server.stop(0);}
    }
}
