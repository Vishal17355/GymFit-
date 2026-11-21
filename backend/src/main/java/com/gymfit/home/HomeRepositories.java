package com.gymfit.home;

import com.gymfit.home.HomeEntities.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.domain.*;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.*;

public final class HomeRepositories {
 private HomeRepositories() {}
 public interface Profiles extends JpaRepository<ProfileEntity,Long> {
  Optional<ProfileEntity> findByUserId(String userId);
  @Lock(LockModeType.PESSIMISTIC_WRITE) @Query("select p from HomeWorkoutProfile p where p.userId=:owner")
  Optional<ProfileEntity> lockOwner(@Param("owner") String userId);
 }
 public interface Exercises extends JpaRepository<ExerciseEntity,String> {}
 public interface Plans extends JpaRepository<PlanEntity,Long> {
  Optional<PlanEntity> findFirstByUserIdOrderByCreatedAtDesc(String userId);
  Optional<PlanEntity> findByIdAndUserId(Long id,String userId);
 }
 public interface Days extends JpaRepository<DayEntity,Long> {
  List<DayEntity> findByPlanIdOrderByScheduledDate(Long planId);
 }
 public interface Sessions extends JpaRepository<SessionEntity,Long> {
  Optional<SessionEntity> findByIdAndUserId(Long id,String userId);
  List<SessionEntity> findByUserIdAndStatusInOrderByStartedAtDesc(String userId,Collection<String> statuses);
  org.springframework.data.domain.Page<SessionEntity> findByUserIdOrderByStartedAtDesc(String userId,Pageable page);
 }
 public interface Enrollments extends JpaRepository<EnrollmentEntity,Long> {
  Optional<EnrollmentEntity> findByUserIdAndChallengeId(String userId,String challengeId);
  List<EnrollmentEntity> findByUserId(String userId);
 }
}
