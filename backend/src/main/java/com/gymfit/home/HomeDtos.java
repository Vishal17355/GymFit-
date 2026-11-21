package com.gymfit.home;

import jakarta.validation.constraints.*;
import java.time.*;
import java.util.*;

public final class HomeDtos {
 private HomeDtos() {}
 public record Profile(
  @Min(18) @Max(79) int age, @DecimalMin("100") @DecimalMax("240") double heightCm,
  @DecimalMin("35") @DecimalMax("220") double weightKg,
  @NotBlank String level, @NotBlank String goal, @Size(max=500) String experience,
  @Min(2) @Max(6) int daysPerWeek, int durationMinutes,
  @NotNull @Size(max=5) String preferredTime,
  @NotNull @Size(max=8) Set<@NotBlank String> equipment,
  @NotNull @Size(max=10) Set<@NotBlank String> focusMuscles,
  @NotNull @Size(max=12) Set<@NotBlank String> limitations,
  @NotNull @Size(max=40) Set<@NotBlank String> discomfortExercises,
  @Size(max=1000) String injuryNotes, boolean lowImpact, boolean seriousLimitation) {}
 public record Exercise(String id,String name,String description,String primaryMuscle,List<String> secondaryMuscles,
  String pattern,Set<String> equipment,String difficulty,String category,List<String> instructions,
  String breathing,List<String> mistakes,List<String> safety,String repsGuidance,int durationSeconds,int restSeconds,
  String mediaUrl,String thumbnail,List<String> easier,List<String> harder,Set<String> limitationTags,double met,String sourceUrl) {}
 public record Prescription(String exerciseId,String phase,int sets,int reps,int seconds,int restSeconds) {}
 public record DayView(Long id,LocalDate date,String title,String kind,double estimatedMinutes,List<Prescription> exercises,boolean completed) {}
 public record PlanView(Long id,long version,Instant createdAt,Profile profile,List<String> notices,List<DayView> days) {}
 public record Generate(@NotNull LocalDate startDate,@Size(max=40) String quickProgram, boolean progressVolume) {}
 public record PlanEdit(@NotNull Long version,@NotNull Long dayId,Long swapDayId,LocalDate date,
  @Size(max=90) String exerciseId,@Size(max=90) String replacementId,boolean add) {}
 public record Start(@NotNull Long planId,@NotNull Long dayId) {}
 public record SetLog(String exerciseId,int setNumber,int reps,int seconds,Instant recordedAt) {}
 public record SessionEdit(@NotNull Long version,@NotBlank String action,String exerciseId,Integer setNumber,
  @Min(0) @Max(100) Integer reps,@Min(0) @Max(600) Integer seconds,
  Integer cursor,String replacementId,@Size(max=2000) String notes,boolean pain) {}
 public record SessionView(Long id,Long planId,Long dayId,LocalDate date,String status,Instant startedAt,Instant endedAt,
  long version,long elapsedSeconds,int cursor,List<Prescription> exercises,List<SetLog> sets,Set<String> skipped,
  String notes,boolean painReported,double estimatedCalories,Set<String> muscles) {}
 public record Page<T>(List<T> items,int page,int size,long total) {}
 public record Week(LocalDate start,int workouts,double minutes) {}
 public record Best(String exerciseId,String name,int bestReps,int bestSeconds,String difficulty) {}
 public record Progress(long completedWorkouts,long completedSets,long totalReps,double totalMinutes,int currentStreak,
  double consistencyPercent,List<Week> weeks,List<Best> personalBests,List<Map<String,Object>> difficultyHistory,
  List<com.gymfit.dto.DietDtos.WeightView> weights,String notice) {}
 public record Challenge(String id,String title,String description,int days,String difficulty,String pattern) {}
 public record Task(LocalDate date,String task,boolean rest,boolean completed) {}
 public record ChallengeView(Challenge challenge,LocalDate startDate,List<Task> tasks,int completed,int required,String status) {}
}
