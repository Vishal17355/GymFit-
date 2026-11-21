package com.gymfit.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name = "food_search_cache")
public class FoodSearchCache {
    @Id @Column(length = 120) public String queryKey;
    @Column(columnDefinition = "text") public String foodIds;
    public Instant expiresAt;
}
