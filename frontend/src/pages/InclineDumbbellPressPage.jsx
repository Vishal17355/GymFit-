import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InclineDumbbellPress3DViewer } from '../components/exercise3d/InclineDumbbellPress3DViewer';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
  ArrowLeft,
  Dumbbell,
  Sparkles,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ChevronRight
} from 'lucide-react';

/**
 * InclineDumbbellPressPage
 * Dedicated full-screen exercise demonstration web application for
 * Incline Dumbbell Bench Press with 3D anatomical skeletal animation.
 */
export const InclineDumbbellPressPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5">
        {/* Navigation Breadcrumb & Back Action */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Link
              to="/planner"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-red-500" />
              <span>3D Anatomy Planner</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-400">Chest Exploration</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-red-400 font-bold">Incline Dumbbell Bench Press</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Upper Chest (Phase 1 Target)
            </span>
          </div>
        </div>

        {/* Hero Title & Anatomical Target Summary */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center text-sm shadow-md shadow-red-600/30">
                <Dumbbell className="w-4 h-4" />
              </span>
              Incline Dumbbell Bench Press
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Anatomically accurate 3D demonstration with a 30-degree incline bench, synchronized dumbbells,
              and live muscle activation highlights.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-slate-300 font-semibold">Primary:</span>
              <span className="text-white font-bold">Upper Chest (Clavicular)</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-300 font-semibold">Secondary:</span>
              <span className="text-amber-300 font-medium">Front Deltoids & Triceps</span>
            </div>
          </div>
        </div>

        {/* 3D Interactive Viewer Viewport */}
        <div className="w-full flex-1 min-h-[580px] lg:min-h-[660px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl relative">
          <InclineDumbbellPress3DViewer
            autoPlay={true}
            className="w-full h-full"
          />
        </div>

        {/* Exercise Coaching Guide & Form Cues */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-red-400 font-bold text-sm">
              <Compass className="w-4 h-4 text-red-500" />
              <span>30° Incline Setup</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Position the bench to 30 degrees. This specific inclination shifts tension directly onto the clavicular
              head without over-engaging the anterior deltoids, which occurs above 45 degrees.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Converging Press Path</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Press the dumbbells upward in a slight arc toward the centerline of the upper chest.
              Do not bang the dumbbells together at the top; maintain soft elbows to preserve constant tension.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Tempo & Respiration</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Adhere to the 3-2-1 cadence: 3 seconds eccentric lowering while inhaling deeply to expand the ribcage,
              2 seconds concentric upward drive while exhaling through pursed lips, and 1 second peak hold.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InclineDumbbellPressPage;
