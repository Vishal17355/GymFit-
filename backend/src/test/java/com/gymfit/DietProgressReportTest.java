package com.gymfit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gymfit.dto.DietDtos.*;
import com.gymfit.entity.*;
import com.gymfit.exception.DietException;
import com.gymfit.repository.*;
import com.gymfit.service.DietProgressReportService;
import java.time.*;
import java.util.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DietProgressReportTest {
    @Mock DietPlanRepository plans;
    @Mock DietProgressReportRepository reports;
    @Mock WeightProgressRepository weights;
    final Clock clock = Clock.fixed(Instant.parse("2026-11-21T10:00:00Z"), ZoneId.of("Asia/Kolkata"));
    final ObjectMapper json = new ObjectMapper().findAndRegisterModules();
    DietProgressReportService service;

    @BeforeEach void setup() {
        service = new DietProgressReportService(plans, reports, weights, json, clock);
    }
    DietPlan plan(LocalDate start, int days) throws Exception {
        DietPlan plan = new DietPlan(); plan.id = 10L; plan.userId = "athlete";
        plan.startDate = start; plan.endDate = start.plusDays(days - 1);
        plan.createdAt = clock.instant();
        plan.profileSnapshot = json.writeValueAsString(NutritionTest.profile(80, "VEGETARIAN", "GAIN"));
        plan.targetCalories = 2000; plan.targetProtein = 100;
        for (int day = 0; day < days; day++) for (int slot = 0; slot < 4; slot++) {
            DietPlanMeal meal = new DietPlanMeal(); meal.id = (long)(day * 4 + slot + 1);
            meal.mealDate = start.plusDays(day); meal.totalCalories = 500; meal.totalProtein = 25;
            plan.meals.add(meal);
        }
        return plan;
    }
    WeightProgress weight(double kg, String date) {
        WeightProgress weight = new WeightProgress(); weight.id = 1L; weight.userId = "athlete";
        weight.weight = kg; weight.recordedAt = LocalDate.parse(date); return weight;
    }

    @Test void futureMealsDoNotInflateProgressOrItsDenominator() throws Exception {
        DietPlan plan = plan(LocalDate.of(2026,11,21), 7);
        plan.meals.get(0).eaten = true; plan.meals.get(4).eaten = true;
        when(reports.findByDietPlan_Id(10L)).thenReturn(Optional.empty());
        var report = service.refresh(plan).metrics();
        assertEquals(1, report.elapsedDays()); assertEquals(4, report.mealsDue());
        assertEquals(1, report.mealsLogged()); assertEquals(25.0, report.mealLoggingPercent());
        assertEquals(500, report.loggedCalories()); assertEquals(25, report.loggedProtein());
        assertEquals(0, report.days().get(1).loggedMeals()); assertTrue(report.days().get(1).future());
        assertNull(report.weightChangeKg()); verify(reports).saveAndFlush(any());
    }
    @Test void scheduledPlansHaveNoPercentagesOrInventedWeightChange() throws Exception {
        DietPlan plan = plan(LocalDate.of(2026,11,22), 7);
        when(reports.findByDietPlan_Id(10L)).thenReturn(Optional.empty());
        var report = service.refresh(plan).metrics();
        assertEquals("SCHEDULED", report.periodStatus()); assertEquals(0, report.elapsedDays());
        assertNull(report.mealLoggingPercent()); assertNull(report.calorieTargetCoveragePercent());
        assertNull(report.averageLoggedCalories()); assertNull(report.latestWeightKg()); assertNull(report.weightChangeKg());
        assertEquals(80, report.baselineWeightKg()); verifyNoInteractions(weights);
    }
    @Test void completedPlansStopAtTheirEndDate() throws Exception {
        DietPlan plan = plan(LocalDate.of(2026,11,18), 3);
        plan.createdAt = Instant.parse("2026-11-18T10:00:00Z"); plan.meals.get(0).eaten = true;
        when(reports.findByDietPlan_Id(10L)).thenReturn(Optional.empty());
        when(weights.findByUserIdAndRecordedAtBetweenOrderByRecordedAt("athlete",plan.startDate,plan.endDate))
            .thenReturn(List.of(weight(79.5,"2026-11-20")));
        var report = service.refresh(plan).metrics();
        assertEquals("COMPLETED", report.periodStatus()); assertEquals(3, report.elapsedDays());
        assertEquals(12, report.mealsDue()); assertEquals(8.3, report.mealLoggingPercent());
        assertEquals(-0.5, report.weightChangeKg()); assertEquals(LocalDate.of(2026,11,20), report.latestWeightDate());
    }
    @Test void generationFreezesRecordedStartingWeightAndRefreshPreservesIt() throws Exception {
        DietPlan plan = plan(LocalDate.of(2026,11,21), 7);
        when(reports.findByDietPlan_Id(10L)).thenReturn(Optional.empty());
        when(weights.findFirstByUserIdAndRecordedAtLessThanEqualOrderByRecordedAtDesc("athlete",plan.startDate))
            .thenReturn(Optional.of(weight(79.4,"2026-11-20")));
        ArgumentCaptor<DietProgressReport> captured = ArgumentCaptor.forClass(DietProgressReport.class);
        var initial = service.createForGeneratedPlan(plan).metrics();
        assertEquals(79.4, initial.baselineWeightKg()); assertEquals("RECORDED_WEIGHT", initial.baselineSource());
        verify(reports).saveAndFlush(captured.capture());
        when(reports.findByDietPlan_Id(10L)).thenReturn(Optional.of(captured.getValue()));
        when(weights.findByUserIdAndRecordedAtBetweenOrderByRecordedAt("athlete",plan.startDate,plan.startDate))
            .thenReturn(List.of(weight(79.2,"2026-11-21")));
        var updated = service.refresh(plan).metrics();
        assertEquals(79.4, updated.baselineWeightKg()); assertEquals(-0.2, updated.weightChangeKg());
        verify(weights,times(1)).findFirstByUserIdAndRecordedAtLessThanEqualOrderByRecordedAtDesc(anyString(),any());
    }
    @Test void unchangedReportReadsDoNotRewriteTheSnapshot() throws Exception {
        DietPlan plan = plan(LocalDate.of(2026,11,22), 7);
        when(reports.findByDietPlan_Id(10L)).thenReturn(Optional.empty());
        service.refresh(plan);
        ArgumentCaptor<DietProgressReport> captured = ArgumentCaptor.forClass(DietProgressReport.class);
        verify(reports).saveAndFlush(captured.capture());
        when(reports.findByDietPlan_Id(10L)).thenReturn(Optional.of(captured.getValue()));
        service.refresh(plan); verify(reports,times(1)).saveAndFlush(any());
    }
    @Test void reportsAreLookedUpThroughTheOwnedPlan() {
        when(plans.findByIdAndUserId(10L,"other-user")).thenReturn(Optional.empty());
        assertThrows(DietException.class,() -> service.get("other-user",10)); verifyNoInteractions(reports, weights);
    }
}
