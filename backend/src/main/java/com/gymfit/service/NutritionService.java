package com.gymfit.service;

import com.gymfit.dto.DietDtos.*;
import com.gymfit.exception.DietException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class NutritionService {
    private final double deficit, surplus, minimum, maximum;
    public NutritionService(@Value("${gymfit.nutrition.deficit:300}") double deficit,
            @Value("${gymfit.nutrition.surplus:250}") double surplus,
            @Value("${gymfit.nutrition.minimum-calories:1500}") double minimum,
            @Value("${gymfit.nutrition.maximum-calories:4000}") double maximum) {
        if (deficit < 0 || deficit > 500 || surplus < 0 || surplus > 500 || minimum < 1200 || maximum > 5000 || maximum <= minimum)
            throw new IllegalStateException("Invalid nutrition adjustment configuration");
        this.deficit = deficit; this.surplus = surplus; this.minimum = minimum; this.maximum = maximum;
    }
    public Nutrition calculate(ProfileRequest p) {
        if (p.age() < 18 || Boolean.TRUE.equals(p.pregnantOrBreastfeeding()) || Boolean.TRUE.equals(p.medicalDietRequired()))
            throw DietException.invalid("Automatic adult meal plans are not appropriate for minors, pregnancy/breastfeeding, or medical dietary requirements. Please consult a qualified dietitian or clinician.");
        double factor = Map.of("SEDENTARY", 1.2, "LIGHT", 1.375, "MODERATE", 1.55, "VERY_ACTIVE", 1.725, "EXTREME", 1.9).get(p.activityLevel());
        double bmr = 10 * p.weightKg() + 6.25 * p.heightCm() - 5 * p.age() + (p.sexForBmr().equals("female") ? -161 : 5);
        double tdee = bmr * factor;
        double adjustment = switch (p.fitnessGoal()) { case "LOSS" -> -Math.min(deficit, tdee * .15); case "GAIN" -> Math.min(surplus, tdee * .15); default -> 0; };
        double calories = Math.max(minimum, tdee + adjustment);
        double protein = p.weightKg() * (p.fitnessGoal().equals("MAINTAIN") ? 1.6 : 2.0);
        double fat = calories * .25 / 9;
        double carbs = (calories - protein * 4 - fat * 9) / 4;
        if (!Double.isFinite(calories) || calories > maximum || carbs < 50 || bmr <= 0)
            throw DietException.invalid("These measurements require an individualized nutrition assessment; no automatic plan was generated.");
        return new Nutrition(round(bmr), round(tdee), factor, round(calories), round(protein), round(carbs), round(fat),
            "Estimates for generally healthy adults, not a medical prescription. Ingredient composition and energy needs vary. Review allergies and preparation details.");
    }
    public static double round(double number) { return Math.round(number * 10.0) / 10.0; }
}
