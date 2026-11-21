import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { StatsCard } from '../components/common/StatsCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthMockContext';
import { mockOwnerStats } from '../data/mockData';
import {
  Building2,
  Users,
  DollarSign,
  Activity,
  UserPlus,
  TrendingUp
} from 'lucide-react';

export const GymOwnerDashboard = () => {
  const { currentUser } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-6xl mx-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Facility Operations</span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <Badge variant="amber" size="sm">3 Locations</Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {currentUser?.gymName}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="primary" size="sm" icon={UserPlus}>
              Enroll Member
            </Button>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatsCard
            title="Monthly Revenue"
            value={mockOwnerStats.monthlyRecurringRevenue}
            subtitle="Subscription recurring"
            change={mockOwnerStats.mrrChange}
            icon={DollarSign}
          />
          <StatsCard
            title="Enrolled Members"
            value={mockOwnerStats.activeMembers}
            subtitle="Across 3 branches"
            change={mockOwnerStats.activeMembersChange}
            icon={Users}
          />
          <StatsCard
            title="Live Headcount"
            value={`${mockOwnerStats.liveOccupancy} / ${mockOwnerStats.liveCapacityMax}`}
            subtitle="42% capacity load"
            icon={Activity}
          />
          <StatsCard
            title="Retention Rate"
            value={mockOwnerStats.memberRetentionRate}
            subtitle="Monthly average"
            change={mockOwnerStats.retentionChange}
            icon={TrendingUp}
          />
        </div>

        {/* Live Capacity Meter & Multi-Branch Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Real-time Headcount (Left) */}
          <div className="lg:col-span-4">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader
                title="Live Facility Headcount"
                action={<span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
              />
              <CardBody className="p-5 flex flex-col items-center text-center">
                
                <div className="w-full my-2">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white">
                      {mockOwnerStats.liveOccupancy}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      / {mockOwnerStats.liveCapacityMax} max
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(mockOwnerStats.liveOccupancy / mockOwnerStats.liveCapacityMax) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Downtown Flagship:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">42 athletes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Westside Center:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">18 athletes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Northgate Express:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">8 athletes</span>
                  </div>
                </div>

              </CardBody>
            </Card>
          </div>

          {/* Branch Financial Breakdown (Right) */}
          <div className="lg:col-span-8">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader title="Branch Breakdown" />
              <CardBody className="p-4 space-y-2.5">
                {mockOwnerStats.branches.map((b) => (
                  <div
                    key={b.name}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.name}</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {b.activeCount} members &bull; {b.currentLive} live now
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                        {b.mrr}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium">Monthly</span>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

        </div>

        {/* Live Turnstile Entrance Audit Log */}
        <Card>
          <CardHeader title="Turnstile Access Stream" />
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5 pl-5">Member</th>
                    <th className="p-3.5">Plan</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5 pr-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                  {mockOwnerStats.recentCheckIns.map((ci, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 pl-5 font-bold text-slate-900 dark:text-white">
                        {ci.name}
                      </td>
                      <td className="p-3.5">{ci.plan}</td>
                      <td className="p-3.5 text-slate-400">{ci.branch}</td>
                      <td className="p-3.5 text-slate-400 font-mono">{ci.time}</td>
                      <td className="p-3.5 pr-5 text-right">
                        <Badge variant={ci.status === 'ALLOWED' ? 'emerald' : 'rose'} size="sm">
                          {ci.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

      </div>
    </DashboardLayout>
  );
};
