package com.gymfit.entity;

import jakarta.persistence.*;
import java.util.*;

@Entity @Table(name = "recipes")
public class Recipe extends BaseEntity {
    @Column(nullable = false, unique = true) public String name;
    @Column(columnDefinition = "text") public String instructions;
    public String mealCategory;
    public String dietaryType;
    public int preparationTime;
    public double servings = 1;
    public String source;
    public String externalRecipeId;
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id") public List<RecipeIngredient> ingredients = new ArrayList<>();
}
