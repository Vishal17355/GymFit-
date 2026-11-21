import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { mockExercises } from '../data/mockData';
import {
  Search,
  Info,
  X,
  Layers,
  Sparkles,
  Dumbbell,
  Play,
  ArrowRight
} from 'lucide-react';

export const ExerciseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('ALL');
  const [activeModalExercise, setActiveModalExercise] = useState(null);

  const muscleGroups = ['ALL', 'Arms', 'Chest', 'Legs', 'Back', 'Shoulders'];

  const filteredExercises = mockExercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ex.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = selectedMuscle === 'ALL' || ex.muscleGroup.toLowerCase().includes(selectedMuscle.toLowerCase());
    return matchesSearch && matchesMuscle;
  });

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-6xl mx-auto">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Exercise Bank</span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="text-xs text-slate-400 font-mono">{filteredExercises.length} Movements</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Movement Catalog
            </h1>
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-72 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name or muscle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Muscle Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {muscleGroups.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedMuscle(group)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedMuscle === group
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        {/* Featured 3D Interactive Animation Spotlight Banner */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 border border-red-900/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30 shrink-0">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
                  Featured 3D Animation
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-red-300 font-semibold">Anatomical Model &amp; Live Rep Counter</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Standing Dumbbell Biceps Curl — 3D Biomechanics Demonstration
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
                Observe strict humerus alignment, full supination, and dynamic red biceps brachii contraction highlighting in a dark gym studio.
              </p>
            </div>
          </div>

          <Link
            to="/bicep-curl"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all inline-flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch 3D Animation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((ex) => (
            <Card key={ex.id} hover className="flex flex-col justify-between">
              <CardBody className="p-4">
                
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant={ex.difficulty === 'Beginner' ? 'emerald' : ex.difficulty === 'Intermediate' ? 'cyan' : 'purple'} size="sm">
                    {ex.difficulty}
                  </Badge>
                  <span className="text-[10px] font-mono text-slate-400">
                    {ex.equipment}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {ex.name}
                </h3>
                
                <p className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 mt-0.5">
                  {ex.muscleGroup}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {ex.instructions}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {ex.secondaryMuscles.map((m) => (
                    <span key={m} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">
                      {m}
                    </span>
                  ))}
                </div>

              </CardBody>

              <div className="p-3 pt-0 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                {ex.has3DAnimation && (
                  <Link
                    to={ex.animationUrl || '/bicep-curl'}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold text-center inline-flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-red-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch 3D Animation</span>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className={ex.has3DAnimation ? 'px-2 text-xs' : 'w-full text-xs'}
                  icon={Info}
                  onClick={() => setActiveModalExercise(ex)}
                >
                  {ex.has3DAnimation ? 'Form Cues' : 'Form & Coaching Cues'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal for detailed cues */}
        {activeModalExercise && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-xl relative">
              
              <button
                onClick={() => setActiveModalExercise(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="cyan" size="sm">{activeModalExercise.difficulty}</Badge>
                <span className="text-xs text-slate-400">{activeModalExercise.equipment}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeModalExercise.name}
              </h3>
              <p className="text-xs font-semibold text-cyan-500 mt-0.5">
                Target: {activeModalExercise.muscleGroup}
              </p>

              <div className="mt-4 space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <h5 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] mb-1">
                    Movement Execution
                  </h5>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {activeModalExercise.instructions}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                  <h5 className="font-bold text-[10px] uppercase tracking-wider mb-1 text-emerald-500">
                    Coaching Cues
                  </h5>
                  <p className="leading-relaxed">
                    {activeModalExercise.tips}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <Button size="sm" onClick={() => setActiveModalExercise(null)}>
                  Close
                </Button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};
