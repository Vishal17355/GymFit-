package com.gymfit.controller;

import com.gymfit.dto.DietDtos.*;
import com.gymfit.service.FoodService;
import jakarta.validation.constraints.*;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/v1/foods")
public class FoodController {
    private final FoodService foods;
    public FoodController(FoodService foods)
    {
        this.foods=foods;
    }
    @GetMapping("/search")
    public FoodSearch search(@RequestParam @Size(min=1,max=120) String query)
    {
        return foods.search(query,false);
    }
    @GetMapping("/catalog")
    public FoodSearch catalog()
    {
        return foods.search("",true);
    }
    @GetMapping("/{id}")
    public FoodView get(@PathVariable @Positive long id)
    {
        return foods.get(id);
    }
    @GetMapping("/usda/{fdcId}")
    public FoodView importFood(@PathVariable @Positive long fdcId)
    {
        return foods.importExact(fdcId);
    }
}
