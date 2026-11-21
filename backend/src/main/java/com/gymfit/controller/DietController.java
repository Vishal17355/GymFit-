package com.gymfit.controller;

import com.gymfit.dto.DietDtos.*;
import com.gymfit.service.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.*;

@RestController @RequestMapping("/api/v1/diet")
public class DietController {
    private final ProfileService profiles;
    private final NutritionService nutrition;
    private final DietPlanService plans;
    private final LegacyImportService imports;
    private final DietProgressReportService reports;
    public DietController(ProfileService profiles,NutritionService nutrition,DietPlanService plans,LegacyImportService imports,DietProgressReportService reports)
    {
        this.profiles=profiles;
        this.nutrition=nutrition;
        this.plans=plans;
        this.imports=imports;
        this.reports=reports;
    }
    @PostMapping("/profile")
    @ResponseStatus(HttpStatus.CREATED)
    public ProfileRequest create(Principal user,@Valid @RequestBody ProfileRequest body)
    {
        return profiles.save(user.getName(),body,true);
    }
    @PutMapping("/profile")
    public ProfileRequest update(Principal user,@Valid @RequestBody ProfileRequest body)
    {
        return profiles.save(user.getName(),body,false);
    }
    @GetMapping("/profile")
    public ProfileRequest profile(Principal user)
    {
        return profiles.get(user.getName());
    }
    @PostMapping("/calculate")
    public Nutrition calculate(@Valid @RequestBody ProfileRequest body)
    {
        return nutrition.calculate(body);
    }
    @PostMapping("/generate")
    @ResponseStatus(HttpStatus.CREATED)
    public PlanView generate(Principal user,@Valid @RequestBody GenerateRequest body)
    {
        return plans.generate(user.getName(),body);
    }
    @GetMapping("/plans")
    public List<PlanView> plans(Principal user)
    {
        return plans.list(user.getName());
    }
    @GetMapping("/plans/{id}")
    public PlanView plan(Principal user,@PathVariable @Positive long id)
    {
        return plans.get(user.getName(),id);
    }
    @GetMapping("/plans/{id}/report")
    public ProgressReportView report(Principal user,@PathVariable @Positive long id)
    {
        return reports.get(user.getName(),id);
    }
    @GetMapping("/plans/{id}/meals/{mealId}/alternatives")
    public List<AlternativeView> alternatives(Principal user,@PathVariable @Positive long id,@PathVariable @Positive long mealId)
    {
        return plans.alternatives(user.getName(),id,mealId);
    }
    @PostMapping("/replace-meal")
    public PlanView replace(Principal user,@Valid @RequestBody ReplaceRequest body)
    {
        return plans.replace(user.getName(),body);
    }
    @PutMapping("/plans/{id}/meals/{mealId}/intake")
    public PlanView intake(Principal user,@PathVariable @Positive long id,@PathVariable @Positive long mealId,@Valid @RequestBody IntakeRequest body)
    {
        return plans.intake(user.getName(),id,mealId,body);
    }
    @PostMapping("/progress")
    public WeightView progress(Principal user,@Valid @RequestBody WeightRequest body)
    {
        return plans.recordWeight(user.getName(),body);
    }
    @PostMapping("/plans/{id}/meals/{mealId}/foods")
    public PlanView food(Principal user,@PathVariable @Positive long id,@PathVariable @Positive long mealId,@Valid @RequestBody MealFoodRequest body)
    {
        return plans.editFood(user.getName(),id,mealId,body);
    }
    @GetMapping("/progress") public List<WeightView> progress(Principal user)
    {
        return plans.weights(user.getName());
    }
    @PostMapping("/import")
    @ResponseStatus(HttpStatus.CREATED) public ImportReceipt archive(Principal user,@Valid @RequestBody ImportRequest body)
    {
        return imports.archive(user.getName(),body);
    }
    @GetMapping("/imports")
    public List<ImportReceipt> archives(Principal user)
    {
        return imports.list(user.getName());
    }
    @GetMapping("/imports/{id}")
    public com.fasterxml.jackson.databind.JsonNode archive(Principal user,@PathVariable @Positive long id)
    {
        return imports.get(user.getName(),id);
    }
}
