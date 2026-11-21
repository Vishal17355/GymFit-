package com.gymfit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gymfit.entity.*;
import com.gymfit.exception.DietException;
import com.gymfit.integration.*;
import com.gymfit.repository.*;
import com.gymfit.service.FoodService;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import java.time.*;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FoodServiceCacheTest {
    @Mock FoodRepository foods;
    @Mock FoodSearchCacheRepository cache;
    @Mock UsdaClient usda;
    FoodService service;
    Food food;
    @BeforeEach void setup(){
        service=new FoodService(foods,cache,usda,new UsdaNutrientMapper(),new ObjectMapper(),30);
        food=new Food();food.id=1L;food.name="Bananas, raw";food.source="USDA";food.externalFoodId="173944";food.lastUpdated=Instant.now();
    }
    @Test void cachedSearchDoesNotRepeatProviderRequests(){
        FoodSearchCache hit=new FoodSearchCache();hit.queryKey="banana";hit.foodIds="[1]";hit.expiresAt=Instant.now().plusSeconds(60);
        when(foods.findTop30ByNameContainingIgnoreCaseOrderById("banana")).thenReturn(List.of(food));
        when(cache.findById("banana")).thenReturn(Optional.of(hit));when(foods.findAllById(List.of(1L))).thenReturn(List.of(food));
        assertEquals(1,service.search("banana",false).foods().size());verifyNoInteractions(usda);
    }
    @Test void providerFailureReturnsOnlyExistingFoodAndExplainsFallback(){
        when(foods.findTop30ByNameContainingIgnoreCaseOrderById("banana")).thenReturn(List.of(food));when(cache.findById("banana")).thenReturn(Optional.empty());
        when(usda.search("banana")).thenThrow(new DietException(HttpStatus.SERVICE_UNAVAILABLE,"PROVIDER_DOWN","Provider unavailable"));
        var result=service.search("banana",false);assertEquals(1,result.foods().size());assertEquals("Provider unavailable",result.notice());verify(foods,never()).save(any());
    }
    @Test void recentlyCachedExactFoodDoesNotFetchAgain(){
        when(foods.findBySourceAndExternalFoodId("USDA","173944")).thenReturn(Optional.of(food));assertEquals(1L,service.importExact(173944).id());verifyNoInteractions(usda);
    }
}
