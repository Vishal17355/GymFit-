package com.gymfit.repository;

import com.gymfit.entity.DietProgressReport;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DietProgressReportRepository extends JpaRepository<DietProgressReport, Long> {
    Optional<DietProgressReport> findByDietPlan_Id(Long planId);
}
