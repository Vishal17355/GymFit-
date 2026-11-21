package com.gymfit.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.*;

@Entity @Table(name = "foods", uniqueConstraints = @UniqueConstraint(columnNames = {"source", "external_food_id"}))
public class Food extends BaseEntity {
    @Column(nullable = false, length = 512) public String name;
    public String source;
    public String externalFoodId;
    public Double calories;
    public Double protein;
    public Double carbohydrates;
    public Double fat;
    public Double fiber;
    public String servingUnit = "g";
    public double servingQuantity = 100;
    public Double originalServingQuantity;
    public String originalServingUnit;
    public String dietType = "UNCLASSIFIED";
    public String preparationState;
    public String sourceUrl;
    public boolean reviewed;
    @Convert(converter = StringListConverter.class) @Column(columnDefinition = "text") public List<String> allergens = new ArrayList<>();
    public Instant lastUpdated;
    public boolean complete() { return calories != null && protein != null && carbohydrates != null && fat != null; }
}
