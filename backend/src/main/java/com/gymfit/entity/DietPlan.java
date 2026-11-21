package com.gymfit.entity;

import jakarta.persistence.*;
import java.time.*;
import java.util.*;

@Entity @Table(name = "diet_plans")
public class DietPlan extends BaseEntity {
    @Column(nullable = false, length = 180) public String userId;
    public LocalDate startDate;
    public LocalDate endDate;
    public double targetCalories;
    public double targetProtein;
    public double targetCarbs;
    public double targetFat;
    public double bmr;
    public double tdee;
    public double activityFactor;
    public String status;
    public Instant createdAt = Instant.now();
    public Instant updatedAt = Instant.now();
    @Column(columnDefinition = "text") public String profileSnapshot;
    @OneToMany(mappedBy = "dietPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("mealDate, id") public List<DietPlanMeal> meals = new ArrayList<>();
    @Version public long version;
}
