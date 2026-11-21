import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { StatsCard } from '../components/common/StatsCard';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthMockContext';
import { mockTrainerClients, mockWorkouts, mockClasses } from '../data/mockData';
import {
  Users,
  CalendarDays,
  Star,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';

export const TrainerDashboard = () => {
  const { currentUser } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-6xl mx-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Coach Portal</span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <Badge variant="purple" size="sm">NASM-CPT</Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Coach {currentUser?.name}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/planner">
              <Button variant="primary" size="sm" icon={Plus}>
                New Workout Split
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatsCard
            title="Active Roster"
            value={currentUser?.activeClientsCount || 16}
            subtitle="Assigned athletes"
            change="+2"
            icon={Users}
          />
          <StatsCard
            title="Compliance"
            value="91.4%"
            subtitle="Routine execution"
            change="+4.2%"
            icon={TrendingUp}
          />
          <StatsCard
            title="Teaching Today"
            value="2 Classes"
            subtitle="CrossFit & HIIT"
            icon={CalendarDays}
          />
          <StatsCard
            title="Coach Score"
            value="4.9"
            subtitle="48 client ratings"
            icon={Star}
          />
        </div>

        {/* Client Roster Table */}
        <Card>
          <CardHeader
            title="Client Roster & Compliance"
            action={
              <Link to="/planner">
                <Button variant="outline" size="sm" icon={Plus}>
                  Assign Split
                </Button>
              </Link>
            }
          />
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5 pl-5">Client</th>
                    <th className="p-3.5">Goal</th>
                    <th className="p-3.5">Assigned Routine</th>
                    <th className="p-3.5">Compliance</th>
                    <th className="p-3.5 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
                  {mockTrainerClients.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 pl-5 font-bold text-slate-900 dark:text-white">
                        {client.name}
                      </td>
                      <td className="p-3.5 text-slate-500">{client.goal}</td>
                      <td className="p-3.5 font-semibold text-cyan-600 dark:text-cyan-400">
                        {client.plan}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: client.adherence }}
                            />
                          </div>
                          <span className="font-mono text-emerald-500 font-bold">{client.adherence}</span>
                        </div>
                      </td>
                      <td className="p-3.5 pr-5 text-right">
                        <Link to="/progress" className="inline-flex items-center gap-1 text-cyan-500 hover:text-cyan-400 font-bold">
                          <span>PRs</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Classes to Teach & Plan Blueprints */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader title="Today's Teaching Schedule" />
            <CardBody className="p-4 space-y-2.5">
              {mockClasses.slice(0, 2).map((c) => (
                <div key={c.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white">{c.name}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-purple-400" />
                      <span>{c.time} &bull; {c.room}</span>
                    </p>
                  </div>
                  <Badge variant="purple" size="sm">{c.capacity - c.spotsLeft} booked</Badge>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Saved Split Blueprints" />
            <CardBody className="p-4 space-y-2.5">
              {mockWorkouts.map((w) => (
                <div key={w.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <h6 className="font-bold text-slate-900 dark:text-white">{w.title}</h6>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{w.exercises.length} movements &bull; {w.estimatedMinutes}m</p>
                  </div>
                  <Link to="/planner">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </Link>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
};
