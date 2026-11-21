import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { GymFit3DAnatomyViewer } from '../components/anatomy3d/GymFit3DAnatomyViewer';
import { MuscleNavigation } from '../components/anatomy3d/MuscleNavigation';
import { ExerciseCard } from '../components/anatomy3d/ExerciseCard';
import { InclineDumbbellPressModal } from '../components/exercise3d/InclineDumbbellPressModal';
import { UNIVERSAL_MUSCLE_CONFIG } from '../components/anatomy3d/modules/universal/universalMuscleConfig';
import {
  ArrowLeft,
  RotateCcw,
  Activity,
  Target,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ZoomIn,
  Compass,
  Dumbbell,
  CheckCircle2,
  X
} from 'lucide-react';

export const WorkoutPlanBuilder = () => {
  // Exploration flow state:
  // exploringMuscle: null (Full-Body View) or a selected body part ('Biceps', 'Chest', 'Triceps', 'Shoulders', 'Back', 'Abs', 'Legs')
  const [exploringMuscle, setExploringMuscle] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showInclineDumbbellModal, setShowInclineDumbbellModal] = useState(false);

  // Selected muscle groups in Full-Body Overview mode
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [hoveredMuscle, setHoveredMuscle] = useState(null);

  // Normalize group names so 'Oblique' and 'Obliques' align seamlessly
  const normalizeGroup = (g) => {
    if (!g) return '';
    const l = g.toLowerCase().trim();
    if (l === 'oblique' || l === 'obliques') return 'abs';
    if (l === 'box' || l === 'abs' || l === 'abs / core' || l === 'core') return 'abs';
    if (l === 'chest' || l === 'pectorals') return 'chest';
    if (l === 'back') return 'back';
    if (l === 'shoulder' || l === 'shoulders') return 'shoulders';
    if (l === 'bicep' || l === 'biceps') return 'biceps';
    if (l === 'tricep' || l === 'triceps') return 'triceps';
    if (l === 'arm' || l === 'arms') return 'arms';
    if (l === 'leg' || l === 'legs') return 'legs';
    if (l === 'calf' || l === 'calves') return 'legs';
    return l;
  };

  // Canonical display name
  const toCanonicalGroup = (name) => {
    if (!name) return 'Chest';
    const norm = normalizeGroup(name);
    if (norm === 'chest') return 'Chest';
    if (norm === 'biceps') return 'Biceps';
    if (norm === 'triceps') return 'Triceps';
    if (norm === 'back') return 'Back';
    if (norm === 'shoulders') return 'Shoulders';
    if (norm === 'arms') return 'Biceps';
    if (norm === 'legs') return 'Legs';
    if (norm === 'abs') return 'Abs';
    return name;
  };

  // Enter Muscle Exploration for ANY body part (Phase 2)
  const handleStartExplore = (muscleKey = 'Biceps') => {
    const canonical = toCanonicalGroup(muscleKey);
    setExploringMuscle(canonical);
    setSelectedMuscles([canonical]);

    const cfg = UNIVERSAL_MUSCLE_CONFIG[canonical];
    if (cfg?.regions?.length > 0) {
      setSelectedRegion(cfg.regions[0].name);
    } else {
      setSelectedRegion(null);
    }
  };

  // Toggle or select muscle in Full-Body or Exploration mode
  const handlePartClick = (bodyPart, details = null) => {
    if (!bodyPart || bodyPart === 'Other') return;

    const canonicalName = toCanonicalGroup(bodyPart);

    // If in full body mode, clicking ANY major body part zooms into its exploration!
    if (!exploringMuscle) {
      handleStartExplore(canonicalName);
      return;
    }

    if (exploringMuscle === canonicalName) {
      // If already exploring this body part and a subregion is clicked
      if (details?.subdivision) {
        if (canonicalName === 'Chest' && (details.subdivision === 'Upper Chest' || details.subdivision.toLowerCase().includes('upper'))) {
          setSelectedRegion('Upper Chest');
          setShowInclineDumbbellModal(true);
          return;
        }
        // Clicking the currently active subregion deselects it!
        setSelectedRegion((prev) => (prev === details.subdivision ? null : details.subdivision));
      } else {
        // Clicking the currently active body part again deselects it and returns to full body!
        handleBackToFullBody();
      }
      return;
    }

    // If clicking a different major body part while exploring, switch to it
    handleStartExplore(canonicalName);
  };

  // Return to Full-Body Overview from Exploration Mode
  const handleBackToFullBody = () => {
    setSelectedMuscles([]);
    setExploringMuscle(null);
    setSelectedRegion(null);
    setShowExerciseModal(false);
    setShowInclineDumbbellModal(false);
  };

  // Reset all selections
  const handleReset = () => {
    setSelectedMuscles([]);
    setExploringMuscle(null);
    setSelectedRegion(null);
    setShowExerciseModal(false);
    setShowInclineDumbbellModal(false);
  };

  // Active muscle configuration & subregion data
  const activeMuscleConfig = exploringMuscle ? UNIVERSAL_MUSCLE_CONFIG[exploringMuscle] : null;

  const activeRegionData =
    activeMuscleConfig && selectedRegion
      ? activeMuscleConfig.regions.find((r) => r.name === selectedRegion) || activeMuscleConfig.regions[0]
      : activeMuscleConfig?.regions?.[0] || null;

  const currentExercises = activeRegionData?.exercises || [];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col">
        {/* Navigation Breadcrumbs & Back Navigation */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
          {exploringMuscle ? (
            <button
              type="button"
              onClick={handleBackToFullBody}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors group px-3.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 shadow-sm"
            >
              <div className="w-6 h-6 rounded-lg bg-red-500 text-white flex items-center justify-center group-hover:-translate-x-0.5 transition-transform">
                <ArrowLeft className="w-3.5 h-3.5" />
              </div>
              <span>Back to Full-Body View</span>
            </button>
          ) : (
            <Link
              to="/dashboard/member"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <span>Back to Member Dashboard</span>
            </Link>
          )}

          <div className="flex items-center gap-2">
            {exploringMuscle && (
              <button
                type="button"
                onClick={handleBackToFullBody}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-600 text-white border border-slate-700/60 text-xs font-bold transition-all shadow-sm group"
                title="Deselect this body part and return to full-body view"
              >
                <X className="w-3.5 h-3.5 text-red-400 group-hover:text-white" />
                <span>Deselect {exploringMuscle}</span>
              </button>
            )}

            {selectedMuscles.length > 0 && !exploringMuscle && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Deselect All ({selectedMuscles.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Breadcrumb Trail Component */}
        <MuscleNavigation
          muscleGroup={exploringMuscle}
          muscleRegion={selectedRegion}
          onNavigateHome={handleBackToFullBody}
          onNavigateGroup={() => setSelectedRegion(null)}
        />

        {/* Header Title Section */}
        <div className="text-center max-w-2xl mx-auto mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5 text-red-500" />
            <span>
              {exploringMuscle
                ? `${activeMuscleConfig?.displayName || exploringMuscle} Exploration Active`
                : 'Interactive 3D Human Anatomy Viewer'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {exploringMuscle
              ? `${activeMuscleConfig?.displayName || exploringMuscle} Detailing & Exercises`
              : 'Interactive 3D Human Anatomy'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {exploringMuscle
              ? `Select any ${exploringMuscle} region directly on the 3D body. Each anatomical head has its own separate floating box & highlight.`
              : 'Hover over any body part to highlight it and view its name. Click any part (e.g. Biceps, Chest, Back) to zoom in and explore its detailed anatomical regions.'}
          </p>
        </div>

        {/* Quick Structure Action Bar (With Select / Deselect) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
          {['Chest', 'Biceps', 'Triceps', 'Shoulders', 'Back', 'Abs', 'Legs'].map((part) => {
            const isSelected = exploringMuscle === part;
            const isHovered = hoveredMuscle && toCanonicalGroup(hoveredMuscle) === part;

            return (
              <button
                key={`btn-major-${part}`}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    // Clicking the already-selected part DESELECTS it!
                    handleBackToFullBody();
                  } else {
                    handleStartExplore(part);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-sm ${
                  isSelected
                    ? 'bg-red-500 text-white shadow-red-500/30 ring-2 ring-red-400 scale-[1.04]'
                    : isHovered
                    ? 'bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-red-400 hover:text-red-500'
                }`}
                title={isSelected ? `Click to deselect ${part} and return to full body` : `Explore ${part}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected ? 'bg-white animate-pulse' : isHovered ? 'bg-red-500' : 'bg-slate-400'
                  }`}
                />
                <span>{part}</span>
                {isSelected && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-black/25 text-white ml-0.5 flex items-center gap-0.5">
                    <X className="w-2.5 h-2.5" />
                    <span>Deselect</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 3D Human Structure Viewport (Full Width, Centered) */}
        <div className="w-full flex-1 flex flex-col items-center">
          <div className="w-full max-w-5xl">
            <GymFit3DAnatomyViewer
              selectedMuscles={exploringMuscle ? [exploringMuscle] : selectedMuscles}
              selectedSubdivision={selectedRegion}
              focusMuscle={exploringMuscle}
              onToggleMuscle={(part, details) => {
                handlePartClick(part, details);
              }}
              onSelectSubdivision={(sub) => {
                setSelectedRegion(sub);
                if (exploringMuscle === 'Chest' && (sub === 'Upper Chest' || sub?.toLowerCase()?.includes('upper'))) {
                  setShowInclineDumbbellModal(true);
                }
              }}
              onOpenExercises={(sub) => {
                if (sub) setSelectedRegion(sub);
                if (exploringMuscle === 'Chest' && (sub === 'Upper Chest' || sub?.toLowerCase()?.includes('upper') || selectedRegion === 'Upper Chest')) {
                  setShowInclineDumbbellModal(true);
                } else {
                  setShowExerciseModal(true);
                }
              }}
              hoveredMuscle={hoveredMuscle}
              onHoverMuscle={setHoveredMuscle}
            />

            {/* Viewport Status & Click Feedback Bar */}
            <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-300">
                  {exploringMuscle ? `Selected ${exploringMuscle} Region:` : 'Active Structure:'}
                </span>

                {exploringMuscle ? (
                  <span className="font-bold text-red-600 dark:text-red-400 px-2.5 py-0.5 rounded bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-900 flex items-center gap-1.5">
                    <span>{exploringMuscle}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span>{selectedRegion || 'All Regions'}</span>
                  </span>
                ) : selectedMuscles.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {selectedMuscles.map((m) => (
                      <span
                        key={m}
                        className="font-bold text-red-600 dark:text-red-400 px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-900"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400 italic">None selected (hover to inspect, click any body part to explore)</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {exploringMuscle === 'Chest' && selectedRegion === 'Upper Chest' && (
                  <button
                    type="button"
                    onClick={() => setShowInclineDumbbellModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs shadow-md shadow-red-600/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 animate-pulse"
                    title="Launch Full 3D Interactive Demonstration"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Watch Incline Dumbbell Press 3D Demo</span>
                  </button>
                )}

                {exploringMuscle && selectedRegion && (
                  <button
                    type="button"
                    onClick={() => setShowExerciseModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-500/25 flex items-center gap-1.5 transition-all hover:scale-102"
                  >
                    <Dumbbell className="w-3.5 h-3.5" />
                    <span>View {selectedRegion} Exercises</span>
                  </button>
                )}

                <div className="hidden sm:flex items-center gap-2 text-slate-400 text-[11px]">
                  <Compass className="w-3.5 h-3.5" />
                  <span>
                    {exploringMuscle
                      ? 'Rotate 360° to view anatomical depth'
                      : 'Full Body View • Hover to identify structures'}
                  </span>
                </div>
              </div>
            </div>

            {/* MODAL: TARGETED EXERCISE EXPLORATION FOR CLICKED REGION */}
            {showExerciseModal && activeRegionData && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
                <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
                  {/* Modal Header */}
                  <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          style={{ backgroundColor: activeRegionData.color || '#ef4444' }}
                          className="w-2.5 h-2.5 rounded-full"
                        />
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                          {exploringMuscle} Exploration
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                          {activeRegionData.anatomicalHead}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                        {activeRegionData.name} Exercises
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {activeRegionData.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowExerciseModal(false)}
                      className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-500 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                      title="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modal Scrollable Exercises Grid */}
                  <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {currentExercises.map((exercise) => (
                        <ExerciseCard
                          key={exercise.id}
                          exercise={exercise}
                          targetRegion={activeRegionData.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FULL-SCREEN 3D SKELETAL EXERCISE DEMONSTRATION POPUP (UPPER CHEST) */}
            <InclineDumbbellPressModal
              isOpen={showInclineDumbbellModal}
              onClose={() => setShowInclineDumbbellModal(false)}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
