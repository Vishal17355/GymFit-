package com.gymfit.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name = "legacy_diet_imports", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "fingerprint"}))
public class LegacyDietImport extends BaseEntity {
    @Column(nullable = false, length = 180) public String userId;
    @Column(nullable = false, length = 64) public String fingerprint;
    @Column(columnDefinition = "longtext", nullable = false) public String payload;
    public Instant importedAt = Instant.now();
}
