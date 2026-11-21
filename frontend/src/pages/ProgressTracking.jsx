import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { StatsCard } from '../components/common/StatsCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { mockBodyMetrics, mockUsers } from '../data/mockData';
import {
  LineChart,
  Trophy,
  Scale,
  Percent,
  Activity,
  Plus
} from 'lucide-react';

export const ProgressTracking = () => {
  const [metricsList, setMetricsList] = useState(mockBodyMetrics);
  const [newWeight, setNewWeight] = useState('');
  const [newBf, setNewBf] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);

  const handleAddMetric = (e) => {
    e.preventDefault();
    if (!newWeight) return;
    const newEntry = {
      date: 'Nov 2026',
      weightKg: parseFloat(newWeight),
      bodyFatPct: parseFloat(newBf) || 13.2,
      muscleMassKg: 43.1
    };
    setMetricsList([...metricsList, newEntry]);
    setShowLogModal(false);
    setNewWeight('');
    setNewBf('');
  };

  const latest = metricsList[metricsList.length - 1];
  const initial = metricsList[0];
  const weightDiff = (latest.weightKg - initial.weightKg).toFixed(1);
  const bfDiff = (latest.bodyFatPct - initial.bodyFatPct).toFixed(1);

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-6xl mx-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Analytics</span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-xs text-slate-400 font-mono">6 Months</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Biometric Trajectory
            </h1>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setShowLogModal(true)}
          >
            Log Entry
          </Button>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatsCard
            title="Weight"
            value={`${latest.weightKg} kg`}
            subtitle={`Base: ${initial.weightKg} kg`}
            change={`${weightDiff} kg`}
            isPositive={parseFloat(weightDiff) < 0}
            icon={Scale}
          />
          <StatsCard
            title="Body Fat"
            value={`${latest.bodyFatPct}%`}
            subtitle={`Base: ${initial.bodyFatPct}%`}
            change={`${bfDiff}%`}
            isPositive={parseFloat(bfDiff) < 0}
            icon={Percent}
          />
          <StatsCard
            title="Muscle Mass"
            value={`${latest.muscleMassKg} kg`}
            subtitle="+1.6 kg lean"
            change="+3.8%"
            isPositive={true}
            icon={Activity}
          />
          <StatsCard
            title="Bench 1RM"
            value={mockUsers.member.personalBest1RM.benchPress}
            subtitle="Verified PR"
            icon={Trophy}
          />
        </div>

        {/* 6-Month Visual Progression Bar Chart */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader
            title="Body Composition Trajectory"
            action={<span className="text-[11px] font-mono text-slate-400 font-medium">May &bull; Oct 2026</span>}
          />
          <CardBody className="p-5">
            
            <div className="w-full h-56 relative flex items-end justify-between pt-6 pb-2 px-1 border-b border-slate-100 dark:border-slate-800">
              
              <div className="absolute inset-x-0 top-10 border-b border-dashed border-slate-100 dark:border-slate-800/60" />
              <div className="absolute inset-x-0 top-24 border-b border-dashed border-slate-100 dark:border-slate-800/60" />
              <div className="absolute inset-x-0 top-38 border-b border-dashed border-slate-100 dark:border-slate-800/60" />

              {metricsList.map((m) => {
                const normalizedHeight = Math.max(20, Math.min(100, ((m.weightKg - 77) / (84 - 77)) * 100));

                return (
                  <div key={m.date} className="flex flex-col items-center gap-1.5 group z-10 flex-1">
                    <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                      {m.weightKg}k
                    </span>
                    
                    <div className="w-6 sm:w-10 bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden h-36 flex items-end">
                      <div
                        className="w-full bg-slate-900 dark:bg-cyan-500 rounded-t-lg transition-all duration-300 group-hover:bg-cyan-600"
                        style={{ height: `${normalizedHeight}%` }}
                      />
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 mt-1">
                      {m.date.split(' ')[0]}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-500 -mt-1">
                      {m.bodyFatPct}%
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-900 dark:bg-cyan-500" />
                  <span>Weight</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-500 font-bold">%</span>
                  <span>Body Fat</span>
                </span>
              </div>
              <span>Trend: Recomposition</span>
            </div>

          </CardBody>
        </Card>

        {/* Milestone PR Record Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card hover className="p-4 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Bench Press</span>
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">115 kg</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Est. 1RM &bull; Verified</p>
          </Card>

          <Card hover className="p-4 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Back Squat</span>
              <Trophy className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">160 kg</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Est. 1RM &bull; Verified</p>
          </Card>

          <Card hover className="p-4 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Deadlift</span>
              <Trophy className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">210 kg</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Est. 1RM &bull; Verified</p>
          </Card>
        </div>

        {/* Log Metric Modal */}
        {showLogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-xl">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">
                Log Biometric Entry
              </h3>
              <p className="text-[11px] text-slate-400 mb-3">
                Update body weight and composition metrics
              </p>

              <form onSubmit={handleAddMetric} className="space-y-3">
                <Input
                  label="Weight (kg)"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 78.8"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  required
                />
                <Input
                  label="Body Fat %"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 13.2"
                  value={newBf}
                  onChange={(e) => setNewBf(e.target.value)}
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowLogModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    Save Entry
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};
