package com.gymfit.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity @Table(name = "weight_progress", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "recorded_at"}))
public class WeightProgress extends BaseEntity {
    @Column(nullable = false, length = 180) public String userId;
    public double weight;
    public LocalDate recordedAt;
}
