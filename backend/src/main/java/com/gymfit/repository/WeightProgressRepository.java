package com.gymfit.repository;
import com.gymfit.entity.WeightProgress;
import org.springframework.data.jpa.repository.*;
import java.util.*;
import java.time.LocalDate;
public interface WeightProgressRepository extends JpaRepository<WeightProgress, Long> {
    List<WeightProgress> findByUserIdOrderByRecordedAt(String userId);
    Optional<WeightProgress> findByUserIdAndRecordedAt(String userId, LocalDate date);
    Optional<WeightProgress> findFirstByUserIdAndRecordedAtLessThanEqualOrderByRecordedAtDesc(String userId, LocalDate date);
    List<WeightProgress> findByUserIdAndRecordedAtBetweenOrderByRecordedAt(String userId, LocalDate startDate, LocalDate endDate);
}
