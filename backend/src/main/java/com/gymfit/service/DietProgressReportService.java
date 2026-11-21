package com.gymfit.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gymfit.dto.DietDtos.*;
import com.gymfit.entity.*;
import com.gymfit.exception.DietException;
import com.gymfit.repository.*;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import static com.gymfit.service.NutritionService.round;

@Service
@Transactional
public class DietProgressReportService {
    private final DietPlanRepository plans;
    private final DietProgressReportRepository reports;
    private final WeightProgressRepository weights;
    private final ObjectMapper json;
    private final Clock clock;

    public DietProgressReportService(DietPlanRepository plans, DietProgressReportRepository reports,
                                     WeightProgressRepository weights, ObjectMapper json, Clock clock) {
        this.plans = plans; this.reports = reports; this.weights = weights;
        this.json = json; this.clock = clock;
    }

    public ProgressReportView get(String userId, long planId) {
        DietPlan plan = plans.findByIdAndUserId(planId, userId)
            .orElseThrow(() -> DietException.missing("Diet plan progress report not found."));
        return refresh(plan);
    }

    public ProgressReportView refresh(DietPlan plan) {
        return refresh(plan, false);
    }

    public ProgressReportView createForGeneratedPlan(DietPlan plan) {
        return refresh(plan, true);
    }

    public LocalDate today() { return LocalDate.now(clock); }

    private ProgressReportView refresh(DietPlan plan, boolean justGenerated) {
        var existing = reports.findByDietPlan_Id(plan.id);
        DietProgressReport report = existing.orElseGet(() -> baseline(plan, justGenerated));
        ProgressMetrics metrics = calculate(plan, report);
        String payload = write(metrics);
        if (!payload.equals(report.metricsSnapshot)) {
            report.metricsSnapshot = payload;
            report.updatedAt = clock.instant();
            reports.saveAndFlush(report);
        }
        return new ProgressReportView(report.id, plan.id, plan.createdAt, report.updatedAt, metrics);
    }

    public void refreshForWeight(String userId, LocalDate recordedAt) {
        plans.findByUserIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(userId, recordedAt, recordedAt)
            .forEach(this::refresh);
    }

    private DietProgressReport baseline(DietPlan plan, boolean justGenerated) {
        DietProgressReport report = new DietProgressReport();
        report.dietPlan = plan;
        report.createdAt = clock.instant();
        report.updatedAt = clock.instant();
        try {
            report.baselineWeightKg = json.readValue(plan.profileSnapshot, ProfileRequest.class).weightKg();
        } catch (Exception failure) {
            throw new IllegalStateException("Cannot read starting weight from saved profile", failure);
        }
        report.baselineRecordedAt = plan.createdAt.atZone(clock.getZone()).toLocalDate();
        report.baselineSource = "PROFILE_AT_GENERATION";
        // Existing plans have only their immutable profile snapshot as a reliable historical baseline.
        // New plans can freeze an already-recorded weight that was available when they were created.
        if (justGenerated) {
            LocalDate cutoff = plan.startDate.isBefore(LocalDate.now(clock)) ? plan.startDate : LocalDate.now(clock);
            weights.findFirstByUserIdAndRecordedAtLessThanEqualOrderByRecordedAtDesc(plan.userId, cutoff)
                .ifPresent(weight -> {
                    report.baselineWeightKg = weight.weight;
                    report.baselineRecordedAt = weight.recordedAt;
                    report.baselineSource = "RECORDED_WEIGHT";
                });
        }
        return report;
    }

    private ProgressMetrics calculate(DietPlan plan, DietProgressReport report) {
        LocalDate today = LocalDate.now(clock);
        LocalDate through = today.isAfter(plan.endDate) ? plan.endDate : today;
        int plannedDays = Math.toIntExact(ChronoUnit.DAYS.between(plan.startDate, plan.endDate) + 1);
        int elapsedDays = today.isBefore(plan.startDate) ? 0 : Math.toIntExact(ChronoUnit.DAYS.between(plan.startDate, through) + 1);
        String status = today.isBefore(plan.startDate) ? "SCHEDULED" : today.isAfter(plan.endDate) ? "COMPLETED" : "IN_PROGRESS";
        Map<LocalDate, List<DietPlanMeal>> grouped = new TreeMap<>();
        plan.meals.forEach(meal -> grouped.computeIfAbsent(meal.mealDate, key -> new ArrayList<>()).add(meal));
        List<ProgressDay> days = new ArrayList<>();
        int mealsDue = 0, loggedMeals = 0;
        double loggedCalories = 0, loggedProtein = 0;
        for (LocalDate date = plan.startDate; !date.isAfter(plan.endDate); date = date.plusDays(1)) {
            List<DietPlanMeal> meals = grouped.getOrDefault(date, List.of());
            boolean future = date.isAfter(today);
            int eaten = 0;
            double calories = 0, protein = 0, plannedCalories = 0, plannedProtein = 0;
            for (DietPlanMeal meal : meals) {
                plannedCalories += meal.totalCalories; plannedProtein += meal.totalProtein;
                if (!future && meal.eaten) { eaten++; calories += meal.totalCalories; protein += meal.totalProtein; }
            }
            if (!future) { mealsDue += meals.size(); loggedMeals += eaten; loggedCalories += calories; loggedProtein += protein; }
            days.add(new ProgressDay(date, round(plannedCalories), round(plannedProtein), round(calories),
                round(protein), eaten, meals.size(), future));
        }
        List<WeightView> history = elapsedDays == 0 ? List.of() : weights
            .findByUserIdAndRecordedAtBetweenOrderByRecordedAt(plan.userId, plan.startDate, through)
            .stream().map(weight -> new WeightView(weight.id, weight.weight, weight.recordedAt)).toList();
        WeightView latest = history.stream().filter(weight -> !weight.recordedAt().isBefore(report.baselineRecordedAt))
            .reduce((previous, next) -> next).orElse(null);
        return new ProgressMetrics(today, plan.startDate, plan.endDate, status, plannedDays, elapsedDays,
            mealsDue, loggedMeals, percent(loggedMeals, mealsDue), round(loggedCalories), round(loggedProtein),
            elapsedDays == 0 ? null : round(loggedCalories / elapsedDays),
            elapsedDays == 0 ? null : round(loggedProtein / elapsedDays), plan.targetCalories, plan.targetProtein,
            percent(loggedCalories, plan.targetCalories * elapsedDays), percent(loggedProtein, plan.targetProtein * elapsedDays),
            report.baselineWeightKg, report.baselineRecordedAt, report.baselineSource,
            latest == null ? null : latest.weight(), latest == null ? null : latest.recordedAt(),
            latest == null ? null : round(latest.weight() - report.baselineWeightKg),
            List.copyOf(days), history,
            "Based on meals marked eaten and recorded weights. Unlogged meals mean unknown intake, not that no food was eaten. Future days are excluded from progress percentages. Targets are nutrition estimates; weight changes alone do not establish their cause.");
    }

    private Double percent(double value, double total) { return total > 0 ? round(value / total * 100) : null; }
    private String write(Object value) {
        try { return json.writeValueAsString(value); }
        catch (Exception failure) { throw new IllegalStateException("Cannot save diet progress report", failure); }
    }
}
