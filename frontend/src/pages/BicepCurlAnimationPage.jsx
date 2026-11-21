import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { StandingBicepCurlViewer } from '../components/exercise3d/StandingBicepCurlViewer';
import {
  Dumbbell,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Layers,
  Sparkles,
  ChevronRight,
  Info,
  Clock,
  Target,
  Repeat,
  Compass,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const BicepCurlAnimationPage = () => {
  const [totalReps, setTotalReps] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-red-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link to="/exercises" className="hover:text-white transition-colors">Exercise Library</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-red-400 font-semibold">3D Standing Biceps Curl Animation</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span>Realistic 3D Biomechanics Demonstration</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Standing Dumbbell Biceps Curl
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
              Interactive 3D anatomical model demonstrating proper isolation, stationary humerus alignment, and safe technique. Featuring live biceps brachii contraction highlighting in red during the concentric lifting phase.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/planner"
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold border border-slate-800 transition-colors inline-flex items-center gap-2"
            >
              <span>Open 3D Muscle Viewer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3D Animation Viewer Container */}
        <div className="w-full">
          <StandingBicepCurlViewer
            autoPlay={true}
            onRepComplete={(reps) => setTotalReps(reps)}
            className="w-full"
          />
        </div>

        {/* Biomechanical Analysis & Coaching Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Card 1: Anatomical Recruitment */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Target Anatomy</h3>
                <p className="text-[11px] text-slate-400">Muscular recruitment breakdown</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-red-950/40 border border-red-800/50">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-red-400">Primary: Biceps Brachii</span>
                  <span className="text-red-300">100% (Highlighted in Red)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Both heads (Caput Longum lateral & Caput Breve medial) are actively engaged. Emphasized via complete supination (palms facing forward).
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-200">Synergist: Brachialis</span>
                  <span className="text-slate-400">Pure Elbow Flexor</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Deep muscle underlying the biceps on the lower humerus, providing structural arm thickness.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-200">Synergist: Brachioradialis</span>
                  <span className="text-slate-400">Forearm Stabilizer</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Anchors the radial margin of the forearm, maintaining wrist stability under dumbbell load.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Safe Exercise Technique & Form Checklist */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Safe Exercise Technique</h3>
                <p className="text-[11px] text-slate-400">Optimal biomechanical execution</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  ✓
                </div>
                <div>
                  <strong className="text-white block font-semibold">Starting Stance:</strong>
                  Feet shoulder-width apart with soft athletic knees to maintain a stable, shock-absorbing base.
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  ✓
                </div>
                <div>
                  <strong className="text-white block font-semibold">Stationary Upper Arms:</strong>
                  Keep elbows pinned snugly against your lateral ribcage. Do not let elbows drift forward or flare out.
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  ✓
                </div>
                <div>
                  <strong className="text-white block font-semibold">Supinated Grip:</strong>
                  Maintain palms facing anteriorly (forward) throughout both lifting and lowering for maximal bicep tension.
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                  ✓
                </div>
                <div>
                  <strong className="text-white block font-semibold">Torso Stability:</strong>
                  Brace your core and glutes to avoid backward swaying or lumbar hyperextension.
                </div>
              </li>
            </ul>
          </div>

          {/* Card 3: Common Mistakes vs. Biomechanical Fixes */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Mistakes to Avoid</h3>
                <p className="text-[11px] text-slate-400">Protect joints & maximize tension</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="font-bold text-amber-400 text-xs mb-1">
                  Swinging Torso / Rocking Hips
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Using momentum transfers load from the biceps to the lower back and anterior deltoids, increasing spinal injury risk.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="font-bold text-amber-400 text-xs mb-1">
                  Elbows Flaring or Drifting Forward
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Allowing elbows to rise forward turns the curl into a front raise, drastically reducing bicep peak contraction tension.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="font-bold text-amber-400 text-xs mb-1">
                  Dropping the Weight Fast (No Eccentric)
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Over 50% of muscle hypertrophy occurs during the controlled eccentric lowering phase. Lower slowly over 2 full seconds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Repetition Cadence & Tempo Guide */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-base font-black text-white">Recommended Tempo: 2 - 1 - 2</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                2 seconds concentric lifting • 1 second peak isometric squeeze • 2 seconds controlled eccentric lowering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
                Session Reps Counted
              </span>
              <span className="text-xl font-black text-white font-mono">{totalReps} Reps</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BicepCurlAnimationPage;
