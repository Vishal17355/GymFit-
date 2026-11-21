export function buildProgressReportCsv(report) {
  const m = report.metrics;
  const weightByDate = new Map(m.weightHistory.map((entry) => [entry.recordedAt, entry.weight]));
  const rows = [
    ['GymFit diet progress report', report.planId],
    ['As of', m.asOfDate],
    ['Plan start', m.startDate],
    ['Plan end', m.endDate],
    ['Status', m.periodStatus],
    ['Starting weight (kg)', m.baselineWeightKg],
    ['Starting weight date', m.baselineRecordedAt],
    ['Starting weight source', m.baselineSource],
    ['Latest recorded weight (kg)', m.latestWeightKg],
    ['Weight change (kg)', m.weightChangeKg],
    ['Meal logging (%)', m.mealLoggingPercent],
    ['Logged calories (kcal)', m.loggedCalories],
    ['Logged protein (g)', m.loggedProtein],
    ['Daily calorie target (kcal)', m.dailyCalorieTarget],
    ['Daily protein target (g)', m.dailyProteinTarget],
    [],
    ['Date', 'Planned kcal', 'Logged kcal', 'Planned protein (g)', 'Logged protein (g)', 'Meals logged', 'Meals planned', 'Weight (kg)', 'Scheduled day']
  ];
  for (const day of m.days) {
    rows.push([day.date, day.plannedCalories, day.future ? null : day.loggedCalories,
      day.plannedProtein, day.future ? null : day.loggedProtein, day.future ? null : day.loggedMeals,
      day.plannedMeals, weightByDate.get(day.date), day.future ? 'Yes' : 'No']);
  }
  rows.push([], ['Note', m.notice]);
  return rows.map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
}

export function weightChartPoints(history) {
  if (history.length < 2) return null;
  const first = Date.parse(history[0].recordedAt);
  const last = Date.parse(history[history.length - 1].recordedAt);
  const low = Math.min(...history.map((entry) => entry.weight)) - 0.2;
  const high = Math.max(...history.map((entry) => entry.weight)) + 0.2;
  return history.map((entry) => ({
    x: 25 + (Date.parse(entry.recordedAt) - first) / Math.max(1, last - first) * 350,
    y: 85 - (entry.weight - low) / (high - low) * 65,
    label: `${entry.recordedAt}: ${entry.weight} kg`
  }));
}
