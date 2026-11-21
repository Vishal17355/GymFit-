import React, { useEffect } from 'react';
import { InclineDumbbellPress3DViewer } from './InclineDumbbellPress3DViewer';
import { X, Dumbbell, Sparkles, Activity } from 'lucide-react';

/**
 * InclineDumbbellPressModal Component
 *
 * Full-screen modal popup triggered when the user clicks "Upper Chest"
 * in the 3D anatomical body structure or exercise cards.
 * Displays the complete 3D interactive demonstration with 30° incline bench,
 * muscular anatomy, red/orange target muscle highlighting, and biomechanical controls.
 */
export const InclineDumbbellPressModal = ({ isOpen, onClose }) => {
  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="incline-dumbbell-modal-title"
    >
      <div className="relative w-full max-w-6xl h-[92vh] max-h-[920px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
              <Dumbbell className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
                  Upper Chest (Phase 1)
                </span>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">•</span>
                <span className="text-xs text-slate-300 font-bold hidden sm:inline flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                  Clavicular Pectoralis Major
                </span>
                <span className="text-xs text-slate-400 font-medium hidden md:inline">•</span>
                <span className="text-xs text-amber-300/90 font-medium hidden md:inline flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                  Front Delts & Triceps
                </span>
              </div>

              <h2
                id="incline-dumbbell-modal-title"
                className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2"
              >
                Incline Dumbbell Bench Press
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  30° Incline
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700/60 shadow-sm"
              title="Close 3D Demo (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Interactive Viewer Body */}
        <div className="flex-1 relative overflow-hidden bg-slate-950">
          <InclineDumbbellPress3DViewer
            autoPlay={true}
            className="w-full h-full"
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default InclineDumbbellPressModal;
