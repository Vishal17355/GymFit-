package com.gymfit.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.time.*;
import java.util.*;

public final class DietDtos {
    private DietDtos() {}
    public record ProfileRequest(
        @Min(14) @Max(100) int age,
        @NotNull @Pattern(regexp = "male|female") String sexForBmr,
        @DecimalMin("120") @DecimalMax("240") double heightCm,
        @DecimalMin("35") @DecimalMax("220") double weightKg,
        @NotNull @Pattern(regexp = "SEDENTARY|LIGHT|MODERATE|VERY_ACTIVE|EXTREME") String activityLevel,
        @NotNull @Pattern(regexp = "LOSS|GAIN|MAINTAIN") String fitnessGoal,
        @NotNull @Pattern(regexp = "VEGAN|VEGETARIAN|EGGETARIAN|NON_VEGETARIAN") String dietaryPreference,
        @Positive @DecimalMax("100000") Double dailyBudget,
        @NotNull @Size(max = 20) List<@NotBlank @Size(max = 80) String> allergies,
        @NotNull @Size(max = 50) List<@NotBlank @Size(max = 80) String> excludedFoods,
        @NotNull @Size(max = 100) List<@NotBlank @Size(max = 80) String> availableFoods,
        @NotNull Boolean pregnantOrBreastfeeding,
        @NotNull Boolean medicalDietRequired,
        @NotNull @Size(max = 100) Map<Long, @NotNull @PositiveOrZero @DecimalMax("100000") Double> pricesPer100g
    ) {}
    public record Nutrition(double bmr, double tdee, double activityFactor, double calories,
                            double protein, double carbs, double fat, String notice) {}
    public record GenerateRequest(@NotNull LocalDate startDate, @Min(1) @Max(7) int days) {}
    public record FoodView(Long id, String name, String source, String externalFoodId, Double calories,
                           Double protein, Double carbohydrates, Double fat, Double fiber,
                           String servingUnit, double servingQuantity, String dietType,
                           List<String> allergens, boolean reviewed, String preparationState, String sourceUrl) {}
    public record FoodSearch(List<FoodView> foods, String notice) {}
    public record IngredientView(Long foodId, String name, double quantity, String unit,
                                 double calories, double protein, double carbs, double fat, String sourceUrl) {}
    public record MealView(Long id, Long recipeId, String mealType, String name, String instructions,
                           double servingMultiplier, double calories, double protein, double carbs,
                           double fat, Double estimatedCost, boolean eaten, boolean customized, List<IngredientView> ingredients) {}
    public record Totals(double calories, double protein, double carbs, double fat, Double cost,
                         double consumedCalories, double consumedProtein, int eatenMeals, int mealCount) {}
    public record DayView(LocalDate date, List<MealView> meals, Totals totals) {}
    public record PlanView(Long id, long version, String status, Instant createdAt, ProfileRequest profile,
                           Nutrition targets, List<DayView> days) {}
    public record ReplaceRequest(@NotNull Long planId, @NotNull Long mealId, @NotNull Long recipeId,
                                 @Positive @DecimalMax("3") double servingMultiplier, @PositiveOrZero long version) {}
    public record WeightRequest(@DecimalMin("35") @DecimalMax("220") double weight,
                                @NotNull @PastOrPresent LocalDate recordedAt) {}
    public record WeightView(Long id, double weight, LocalDate recordedAt) {}
    public record ProgressDay(LocalDate date, double plannedCalories, double plannedProtein,
                              double loggedCalories, double loggedProtein, int loggedMeals,
                              int plannedMeals, boolean future) {}
    public record ProgressMetrics(LocalDate asOfDate, LocalDate startDate, LocalDate endDate,
                                  String periodStatus, int plannedDays, int elapsedDays,
                                  int mealsDue, int mealsLogged, Double mealLoggingPercent,
                                  double loggedCalories, double loggedProtein,
                                  Double averageLoggedCalories, Double averageLoggedProtein,
                                  double dailyCalorieTarget, double dailyProteinTarget,
                                  Double calorieTargetCoveragePercent, Double proteinTargetCoveragePercent,
                                  double baselineWeightKg, LocalDate baselineRecordedAt, String baselineSource,
                                  Double latestWeightKg, LocalDate latestWeightDate, Double weightChangeKg,
                                  List<ProgressDay> days, List<WeightView> weightHistory, String notice) {}
    public record ProgressReportView(Long id, Long planId, Instant planGeneratedAt,
                                     Instant updatedAt, ProgressMetrics metrics) {}
    public record IntakeRequest(@NotNull Boolean eaten, @PositiveOrZero long version) {}
    public record MealFoodRequest(@NotNull Long foodId, @DecimalMin("1") @DecimalMax("1000") double quantity,
                                  @Min(-1) int ingredientIndex, @PositiveOrZero long version) {}
    public record AlternativeView(Long recipeId, String name, double servingMultiplier, double calories,
                                  double protein, double carbs, double fat, Double estimatedCost) {}
    public record ImportRequest(@NotNull @Valid ProfileRequest profile, @NotNull JsonNode legacyData) {}
    public record ImportReceipt(Long id, String fingerprint, Instant importedAt, boolean existing) {}
    public record ApiError(String code, String message, Map<String, String> fields, Instant timestamp) {}
}
