package com.gymfit.home;

import jakarta.persistence.*;
import com.gymfit.entity.BaseEntity;
import java.time.*;

public final class HomeEntities {
 private HomeEntities() {}
 @Entity(name="HomeWorkoutProfile") @Table(name="home_workout_profiles")
 public static class ProfileEntity extends BaseEntity {
  @Column(nullable=false,unique=true,length=180) public String userId;
  @Column(nullable=false,columnDefinition="LONGTEXT") public String profileJson;
  @Column(nullable=false) public Instant updatedAt;
  @Version public long version;
 }
 @Entity(name="HomeExercise") @Table(name="home_exercises")
 public static class ExerciseEntity {
  @Id @Column(length=90) public String id;
  @Column(nullable=false,columnDefinition="LONGTEXT") public String contentJson;
  @Column(nullable=false) public int catalogVersion;
 }
 @Entity(name="HomeWorkoutPlan") @Table(name="home_workout_plans")
 public static class PlanEntity extends BaseEntity {
  @Column(nullable=false,length=180) public String userId;
  @Column(nullable=false) public LocalDate startDate;
  @Column(nullable=false) public Instant createdAt;
  @Column(nullable=false) public Instant updatedAt;
  @Column(nullable=false,columnDefinition="LONGTEXT") public String profileJson;
  @Column(nullable=false,columnDefinition="LONGTEXT") public String noticesJson;
  @Version public long version;
 }
 @Entity(name="HomeWorkoutDay") @Table(name="home_workout_days")
 public static class DayEntity extends BaseEntity {
  @Column(nullable=false) public Long planId;
  @Column(nullable=false) public LocalDate scheduledDate;
  @Column(nullable=false,length=120) public String title;
  @Column(nullable=false,length=30) public String kind;
  @Column(nullable=false,columnDefinition="LONGTEXT") public String exercisesJson;
  public double estimatedMinutes;
 }
 @Entity(name="HomeWorkoutSession") @Table(name="home_workout_sessions")
 public static class SessionEntity extends BaseEntity {
  @Column(nullable=false,length=180) public String userId;
  @Column(nullable=false) public Long planId;
  @Column(nullable=false) public Long dayId;
  @Column(nullable=false) public LocalDate sessionDate;
  @Column(nullable=false) public Instant startedAt;
  public Instant endedAt;
  public Instant runningSince;
  @Column(nullable=false,length=30) public String status;
  public long activeSeconds;
  public int cursorIndex;
  @Column(nullable=false,columnDefinition="LONGTEXT") public String exercisesJson;
  @Column(nullable=false,columnDefinition="LONGTEXT") public String setsJson;
  @Column(nullable=false,columnDefinition="LONGTEXT") public String skippedJson;
  @Column(nullable=false,length=2000) public String notes;
  public boolean painReported;
  public double weightKg;
  @Version public long version;
 }
 @Entity(name="HomeChallengeEnrollment") @Table(name="home_challenge_enrollments")
 public static class EnrollmentEntity extends BaseEntity {
  @Column(nullable=false,length=180) public String userId;
  @Column(nullable=false,length=60) public String challengeId;
  @Column(nullable=false) public LocalDate startDate;
 }
}

