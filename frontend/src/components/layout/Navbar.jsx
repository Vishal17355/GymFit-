import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../theme/ThemeToggle';
import { useAuth } from '../../context/AuthMockContext';
import { Activity, CalendarDays, Dumbbell, House, LayoutDashboard, ChevronRight, Menu } from 'lucide-react';

const memberLinks = [
  { to: '/dashboard/member', label: 'Home', icon: House },
  { to: '/member/nutrition-diary', label: 'Diary', icon: CalendarDays },
  { to: '/home-workout', label: 'Workout', icon: Dumbbell },
  { to: '/progress', label: 'Progress', icon: Activity }
];
const roles = [['MEMBER', 'Member'], ['TRAINER', 'Trainer'], ['GYM_OWNER', 'Owner']];

export const Navbar = () => {
  const auth = useAuth();
  const location = useLocation();

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);
  const showMemberDock = !isPublicPage && (auth.currentRole === 'MEMBER' || location.pathname.startsWith('/member/') || location.pathname === '/home-workout') && !['/dashboard/trainer', '/dashboard/owner'].includes(location.pathname);

  return (
    <><header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand & Context */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-cyan-300 text-cyan-200 dark:text-slate-950 grid place-items-center transition-colors">
              <Activity className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              Gym<span className="text-cyan-500">Fit</span>
            </span>
          </Link>

          {/* In-app workspace breadcrumb (replaces redundant links on dashboard pages) */}
          {!isPublicPage && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 pl-3 border-l border-slate-200 dark:border-slate-800">
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {auth.currentUser?.gymName || 'Apex Fitness'}
              </span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-500">
                {auth.currentUser?.branch || 'Downtown Flagship'}
              </span>
            </div>
          )}
        </div>

        {/* Public Marketing Links (Only on public landing/login/register pages) */}
        {isPublicPage && (
          <nav aria-label="Platform" className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Link to="/" className="hover:text-cyan-500 transition-colors">Platform</Link>
            <Link to="/bicep-curl" className="text-red-500 dark:text-red-400 font-bold hover:text-red-600 transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>3D Bicep Curl</span>
            </Link>
            <Link to="/exercises" className="hover:text-cyan-500 transition-colors">Exercise Library</Link>
            <Link to="/planner" className="hover:text-cyan-500 transition-colors">Workout Planner</Link>
            <Link to="/home-workout" className="hover:text-cyan-500 transition-colors">Home Workout</Link>
            <Link to="/progress" className="hover:text-cyan-500 transition-colors">Biometrics</Link>
          </nav>
        )}

        {/* Right Section: Persona Switcher, Theme & Portal Access */}
        <div className="flex items-center gap-2.5">
          
          {/* Persona Switcher Pill (Clean, minimal evaluator toolbar) */}
          <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium">
            <button
              onClick={() => auth.switchRole('MEMBER')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                auth.currentRole === 'MEMBER'
                  ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Member
            </button>
            <button
              onClick={() => auth.switchRole('TRAINER')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                auth.currentRole === 'TRAINER'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Trainer
            </button>
            <button
              onClick={() => auth.switchRole('GYM_OWNER')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                auth.currentRole === 'GYM_OWNER'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Owner
            </button>
          </div>

          <details key={location.pathname} className="relative md:hidden">
            <summary aria-label="Open workspace menu" className="grid place-items-center size-10 rounded-xl bg-slate-100 dark:bg-slate-800 list-none cursor-pointer [&::-webkit-details-marker]:hidden"><Menu size={18} /></summary>
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 p-2 border border-slate-200 dark:border-slate-700 shadow-xl">
              {roles.map(([role, label]) => <button key={role} type="button" aria-pressed={role === auth.currentRole}
                onClick={event => { auth.switchRole(role); event.currentTarget.closest('details').open = false; }}
                className="w-full text-left p-2 rounded-lg text-sm font-semibold aria-pressed:bg-cyan-100 dark:aria-pressed:bg-cyan-950">{label}</button>)}
              <Link to="/exercises" className="block p-2 text-sm">Exercise library</Link>
              <Link to="/planner" className="block p-2 text-sm">Workout planner</Link>
            </div>
          </details>

          <ThemeToggle />

          {/* Action Button */}
          {auth.isAuthenticated ? (
            <Link
              aria-label="Workspace"
              to={
                auth.currentRole === 'GYM_OWNER'
                  ? '/dashboard/owner'
                  : auth.currentRole === 'TRAINER'
                  ? '/dashboard/trainer'
                  : '/dashboard/member'
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 transition-colors shadow-sm"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Workspace</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-950 transition-colors shadow-sm"
            >
              Sign In
            </Link>
          )}

        </div>
      </div>
    </header>
    {showMemberDock && <nav aria-label="Member navigation" className="gym-mobile-nav md:hidden fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 gap-1 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      {memberLinks.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `min-h-[48px] flex flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold ${isActive ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-200' : 'text-slate-600 dark:text-slate-300'}`}><Icon size={18} aria-hidden="true" />{label}</NavLink>)}
    </nav>}</>
  );
};
