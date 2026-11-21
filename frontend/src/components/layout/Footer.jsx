import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ShieldCheck, Zap, Activity } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand & Summary (Spans 2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-bold">
                <Dumbbell className="w-4 h-4 -rotate-45" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                Gym<span className="text-cyan-500">Fit</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">&bull;</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Enterprise Athletic OS</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Unified SaaS platform for modern fitness facilities, coaching staff, and athletes. Combining sub-100ms turnstile access, progressive overload programming, and multi-branch operations.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational &bull; Turnstile Latency &lt;45ms</span>
            </div>
          </div>

          {/* Platform Features Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <li>
                <Link to="/dashboard/owner" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Gym Management
                </Link>
              </li>
              <li>
                <Link to="/planner" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Workout Planner
                </Link>
              </li>
              <li>
                <Link to="/exercises" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Exercise Library
                </Link>
              </li>
              <li>
                <Link to="/progress" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Progress Tracking
                </Link>
              </li>
              <li>
                <Link to="/progress" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Biometrics &amp; Recomp
                </Link>
              </li>
            </ul>
          </div>

          {/* Workspaces Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Workspaces
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <li>
                <Link to="/dashboard/member" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Member Portal &amp; QR Pass
                </Link>
              </li>
              <li>
                <Link to="/dashboard/trainer" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Trainer Roster &amp; Splits
                </Link>
              </li>
              <li>
                <Link to="/dashboard/owner" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                  Gym Owner Operations
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Admin Control Engine
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Switch Demo Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Security Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Architecture
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                <span>Multi-Tenant Data Isolation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Sub-100ms Turnstile Verification</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Stateless Dual-Token JWT</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>Automated PR Detection</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>
            &copy; {new Date().getFullYear()} GymFit SaaS Platform. Built with Spring Boot 3 &amp; React.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="font-mono text-[11px] text-slate-500">v1.0.0-PROD</span>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <Link to="/register" className="hover:text-slate-700 dark:hover:text-slate-300">
              Start Free Trial
            </Link>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <Link to="/login" className="hover:text-slate-700 dark:hover:text-slate-300">
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
