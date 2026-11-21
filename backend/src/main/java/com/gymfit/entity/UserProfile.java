package com.gymfit.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.*;

@Entity @Table(name = "user_profiles")
public class UserProfile extends BaseEntity {
    @Column(nullable = false, unique = true, length = 180) public String userId;
    public int age;
    public String sexForBmr;
    public double heightCm;
    public double weightKg;
    public String activityLevel;
    public String fitnessGoal;
    public String dietaryPreference;
    public Double dailyBudget;
    public boolean pregnantOrBreastfeeding;
    public boolean medicalDietRequired;
    @Convert(converter = StringListConverter.class) @Column(columnDefinition = "text") public List<String> allergies = new ArrayList<>();
    @Convert(converter = StringListConverter.class) @Column(columnDefinition = "text") public List<String> excludedFoods = new ArrayList<>();
    @Convert(converter = StringListConverter.class) @Column(columnDefinition = "text") public List<String> availableFoods = new ArrayList<>();
    @ElementCollection @CollectionTable(name = "user_food_prices", joinColumns = @JoinColumn(name = "profile_id"))
    @MapKeyColumn(name = "food_id") @Column(name = "price_per_100g")
    public Map<Long, Double> pricesPer100g = new HashMap<>();
    public Instant createdAt;
    public Instant updatedAt;
    @Version public long version;
    @PrePersist void create() { createdAt = updatedAt = Instant.now(); }
    @PreUpdate void update() { updatedAt = Instant.now(); }
}
