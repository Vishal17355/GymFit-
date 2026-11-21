package com.gymfit.entity;

import jakarta.persistence.*;

@Entity @Table(name = "recipe_ingredients")
public class RecipeIngredient extends BaseEntity {
    @ManyToOne(optional = false, fetch = FetchType.LAZY) @JoinColumn(name = "recipe_id") public Recipe recipe;
    @ManyToOne(optional = false, fetch = FetchType.EAGER) @JoinColumn(name = "food_id") public Food food;
    public double quantity;
    public String unit = "g";
}
