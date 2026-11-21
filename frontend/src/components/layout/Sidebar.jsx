import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthMockContext';
import {
  LayoutDashboard,
  Dumbbell,
  LineChart,
  ClipboardList,
  LogOut,
  Building2
} from 'lucide-react';

export const Sidebar = () => {
  const { currentUser, currentRole, logout } = useAuth();

  const memberLinks = [
    { name: 'Overview', to: '/dashboard/member', icon: LayoutDashboard },
    { name: 'Workout Routine', to: '/planner', icon: ClipboardList },
    { name: 'Home Workout', to: '/home-workout', icon: Dumbbell },
    { name: 'Nutrition Diary', to: '/member/nutrition-diary', icon: ClipboardList },
    { name: 'Exercise Library', to: '/exercises', icon: Dumbbell },
    { name: 'Biometrics & PRs', to: '/progress', icon: LineChart },
  ];

  const trainerLinks = [
    { name: 'Trainer Hub', to: '/dashboard/trainer', icon: LayoutDashboard },
    { name: 'Split Planner', to: '/planner', icon: ClipboardList },
    { name: 'Exercise Bank', to: '/exercises', icon: Dumbbell },
    { name: 'Client Progress', to: '/progress', icon: LineChart },
  ];

  const ownerLinks = [
    { name: 'Operations', to: '/dashboard/owner', icon: LayoutDashboard },
    { name: 'Exercise Catalog', to: '/exercises', icon: Dumbbell },
    { name: 'Program Splits', to: '/planner', icon: ClipboardList },
    { name: 'Retention & Trends', to: '/progress', icon: LineChart },
  ];

  const links =
    currentRole === 'GYM_OWNER'
      ? ownerLinks
      : currentRole === 'TRAINER'
      ? trainerLinks
      : memberLinks;

  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-3 min-h-[calc(100vh-3.5rem)]">
      <div className="space-y-4">
        
        {/* User Persona Profile */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-8 h-8 rounded-lg object-cover"
          />
          <div className="overflow-hidden min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              {currentUser?.name}
            </h4>
            <p className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
              {currentRole.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-0.5">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.to.startsWith('/dashboard/')}
                className={({ isActive }) => `
                  flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
                  ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

      </div>

      {/* Logout / Switch Role */}
      <button
        onClick={logout}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors w-full"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Exit Session</span>
      </button>
    </aside>
  );
};
