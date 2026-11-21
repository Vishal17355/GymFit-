import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { WorkoutPlanCard } from '../components/member/WorkoutPlanCard';
import { HomeWorkoutPlanCard } from '../components/member/HomeWorkoutPlanCard';
import { DietPlanCard } from '../components/member/DietPlanCard';
import { NutritionWidget } from '../components/member/NutritionWidget';
import { ArrowLeft, Activity, ArrowRight } from 'lucide-react';

export const MemberDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-6 sm:py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Back Navigation to Landing Page */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Dashboard Header */}
        <div className="text-left">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Your GymFit dashboard
          </h1>
        </div>
        <NutritionWidget />

        {/* The Three Clickable Cards (Workout Plan, Home Workout Plan, Diet Plan) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <WorkoutPlanCard to="/member/workout-plan" />
          <HomeWorkoutPlanCard to="/home-workout" />
          <DietPlanCard to="/member/diet-plan" />
        </div>
        <Link to="/progress" className="gym-feature-link mt-4"><span className="flex items-center gap-2 font-semibold"><Activity size={18} /> View progress</span><ArrowRight size={17} /></Link>

      </main>

      <Footer />
    </div>
  );
};
