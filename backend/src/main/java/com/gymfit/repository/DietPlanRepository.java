package com.gymfit.repository;
import com.gymfit.entity.DietPlan;
import org.springframework.data.jpa.repository.*;
import java.util.*;
import java.time.LocalDate;
public interface DietPlanRepository extends JpaRepository<DietPlan, Long> {
    List<DietPlan> findTop30ByUserIdOrderByCreatedAtDesc(String userId);
    Optional<DietPlan> findByIdAndUserId(Long id, String userId);
    List<DietPlan> findByUserIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(String userId, LocalDate startBound, LocalDate endBound);
}
