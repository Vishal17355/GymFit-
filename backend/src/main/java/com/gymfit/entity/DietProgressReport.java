package com.gymfit.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "diet_progress_reports")
public class DietProgressReport extends BaseEntity {
    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "diet_plan_id", nullable = false, unique = true)
    public DietPlan dietPlan;
    public double baselineWeightKg;
    public LocalDate baselineRecordedAt;
    public String baselineSource;
    public Instant createdAt;
    public Instant updatedAt;
    @Version public long version;
    @Column(columnDefinition = "longtext", nullable = false)
    public String metricsSnapshot;
}
