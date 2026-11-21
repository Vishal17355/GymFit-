import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildProgressReportCsv, weightChartPoints } from '../src/utils/dietProgressReport.js';

test('downloaded report uses server totals and leaves future intake blank', () => {
  const report = { planId: 12, metrics: {
    asOfDate: '2026-11-21', startDate: '2026-11-21', endDate: '2026-11-22', periodStatus: 'IN_PROGRESS',
    baselineWeightKg: 80, baselineRecordedAt: '2026-11-21', baselineSource: 'PROFILE_AT_GENERATION',
    latestWeightKg: 79.5, weightChangeKg: -0.5, mealLoggingPercent: 25, loggedCalories: 500,
    loggedProtein: 25, dailyCalorieTarget: 2000, dailyProteinTarget: 100,
    weightHistory: [{ recordedAt: '2026-11-21', weight: 79.5 }],
    days: [
      { date: '2026-11-21', plannedCalories: 2000, loggedCalories: 500, plannedProtein: 100, loggedProtein: 25, loggedMeals: 1, plannedMeals: 4, future: false },
      { date: '2026-11-22', plannedCalories: 2000, loggedCalories: 0, plannedProtein: 100, loggedProtein: 0, loggedMeals: 0, plannedMeals: 4, future: true }
    ], notice: 'Unlogged intake is "unknown".'
  } };
  const csv = buildProgressReportCsv(report);
  assert.ok(csv.includes('"Weight change (kg)","-0.5"'));
  assert.ok(csv.includes('"2026-11-21","2000","500","100","25","1","4","79.5","No"'));
  assert.ok(csv.includes('"2026-11-22","2000","","100","","","4","","Yes"'));
  assert.ok(csv.includes('Unlogged intake is ""unknown"".'));
});

test('weight charts use recorded dates without inventing intermediate measurements', () => {
  assert.equal(weightChartPoints([]), null);
  assert.equal(weightChartPoints([{ recordedAt: '2026-11-21', weight: 80 }]), null);
  const points = weightChartPoints([
    { recordedAt: '2026-11-19', weight: 80 },
    { recordedAt: '2026-11-21', weight: 79.5 },
    { recordedAt: '2026-11-25', weight: 79.5 }
  ]);
  assert.equal(points.length, 3);
  assert.equal(points[0].x, 25);
  assert.equal(points[2].x, 375);
  assert.ok(Math.abs((points[1].x - 25) / 350 - 2 / 6) < .001);
  assert.ok(points.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y)));
});
