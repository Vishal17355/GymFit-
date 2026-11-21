package com.gymfit.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity @Table(name = "diet_plan_meals", uniqueConstraints = @UniqueConstraint(columnNames = {"diet_plan_id", "meal_date", "meal_type"}))
public class DietPlanMeal extends BaseEntity {
    @ManyToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "diet_plan_id") public DietPlan dietPlan;
    @ManyToOne(optional = false, fetch = FetchType.EAGER) @JoinColumn(name = "recipe_id") public Recipe recipe;
    public LocalDate mealDate;
    public String mealType;
    public double servingMultiplier;
    public double totalCalories;
    public double totalProtein;
    public double totalCarbs;
    public double totalFat;
    public Double estimatedCost;
    public boolean eaten;
    public boolean customized;
    // Freeze ingredient quantities/nutrients so later catalog refreshes cannot rewrite history.
    @Column(columnDefinition = "text") public String ingredientSnapshot;
}
