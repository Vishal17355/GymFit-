import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { mockExercises, mockTrainerClients } from '../data/mockData';
import {
  Plus,
  Trash2,
  Save,
  Check,
  Search,
  Dumbbell
} from 'lucide-react';

export const WorkoutPlanner = () => {
  const [title, setTitle] = useState('Push Hypertrophy Block');
  const [goal, setGoal] = useState('Chest & Shoulder Volume Overload');
  const [durationWeeks, setDurationWeeks] = useState(6);
  const [targetType, setTargetType] = useState('CLIENT'); // 'TEMPLATE' | 'CLIENT'
  const [selectedClientId, setSelectedClientId] = useState(101);
  const [saved, setSaved] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('ALL');

  const [routineExercises, setRoutineExercises] = useState([
    { id: 're-1', exerciseId: 1, name: 'Barbell Bench Press', muscle: 'Chest', sets: 4, reps: '8-10', load: '85 kg', rest: '90s', rpe: '8' },
    { id: 're-2', exerciseId: 4, name: 'Incline Dumbbell Press', muscle: 'Chest', sets: 3, reps: '10-12', load: '32 kg', rest: '75s', rpe: '8.5' },
    { id: 're-3', exerciseId: 5, name: 'Standing Military Press', muscle: 'Shoulders', sets: 3, reps: '8', load: '55 kg', rest: '90s', rpe: '8' },
    { id: 're-4', exerciseId: 8, name: 'Dumbbell Lateral Raise', muscle: 'Shoulders', sets: 4, reps: '15', load: '12 kg', rest: '60s', rpe: '9' }
  ]);

  const updateExerciseField = (id, field, value) => {
    setRoutineExercises(prev =>
      prev.map(item => item.id === id ? { ...item, [field]: value } : item)
    );
  };

  const addExercise = (ex) => {
    const newEntry = {
      id: `re-${Date.now()}`,
      exerciseId: ex.id,
      name: ex.name,
      muscle: ex.muscleGroup.split(' ')[0],
      sets: 3,
      reps: '10',
      load: '40 kg',
      rest: '60s',
      rpe: '8'
    };
    setRoutineExercises(prev => [...prev, newEntry]);
  };

  const removeExercise = (id) => {
    setRoutineExercises(prev => prev.filter(item => item.id !== id));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const filteredCatalog = mockExercises.filter(ex => {
    const matchSearch = ex.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                        ex.muscleGroup.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchMuscle = selectedMuscle === 'ALL' || ex.muscleGroup.toLowerCase().includes(selectedMuscle.toLowerCase());
    return matchSearch && matchMuscle;
  });

  const muscleFilters = ['ALL', 'Chest', 'Back', 'Legs', 'Shoulders'];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Programmer</span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <Badge variant="cyan" size="sm">Active Draft</Badge>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl sm:text-3xl font-extrabold bg-transparent text-slate-900 dark:text-white border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-cyan-500 focus:outline-none transition-colors w-full"
            />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Saved</span>
              </span>
            )}
            <Button
              variant="primary"
              size="md"
              icon={Save}
              onClick={handleSave}
            >
              Deploy Split
            </Button>
          </div>
        </div>

        {/* Configuration Bar */}
        <Card className="p-4 bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            
            {/* Target Goal */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Primary Goal
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Strength & Muscular Volume"
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Duration (Weeks)
              </label>
              <input
                type="number"
                min="1"
                max="52"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(Number(e.target.value))}
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Assignment Segmented Control */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Assigned Target
              </label>
              <div className="flex rounded-lg bg-slate-200/60 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setTargetType('CLIENT')}
                  className={`flex-1 py-1 rounded-md font-semibold transition-all ${
                    targetType === 'CLIENT'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Client
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType('TEMPLATE')}
                  className={`flex-1 py-1 rounded-md font-semibold transition-all ${
                    targetType === 'TEMPLATE'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Template
                </button>
              </div>
            </div>

          </div>

          {targetType === 'CLIENT' && (
            <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500">Target Member:</span>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(Number(e.target.value))}
                className="font-semibold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {mockTrainerClients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} &bull; {c.goal}</option>
                ))}
              </select>
            </div>
          )}
        </Card>

        {/* Main Work Area: Sequence & Quick Add */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Sequence List */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Prescribed Sequence</h3>
                <span className="text-xs text-slate-400 font-mono">({routineExercises.length})</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Est. 55-65 mins</span>
            </div>

            <div className="space-y-2.5">
              {routineExercises.map((item, idx) => (
                <div
                  key={item.id}
                  className="group p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Left: Index & Exercise Meta */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </h4>
                        <Badge variant="cyan" size="sm" className="shrink-0">{item.muscle}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Rest: {item.rest} &bull; RPE: {item.rpe}
                      </p>
                    </div>
                  </div>

                  {/* Right: Quick Prescription Fields */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono">
                      <div className="flex items-center gap-1 px-1.5">
                        <span className="text-slate-400">Sets:</span>
                        <input
                          type="text"
                          value={item.sets}
                          onChange={(e) => updateExerciseField(item.id, 'sets', e.target.value)}
                          className="w-7 text-center font-bold bg-transparent text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <span className="text-slate-300 dark:text-slate-700">&times;</span>
                      <div className="flex items-center gap-1 px-1.5">
                        <span className="text-slate-400">Reps:</span>
                        <input
                          type="text"
                          value={item.reps}
                          onChange={(e) => updateExerciseField(item.id, 'reps', e.target.value)}
                          className="w-11 text-center font-bold bg-transparent text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                      <span className="text-slate-300 dark:text-slate-700">@</span>
                      <div className="flex items-center gap-1 px-1.5">
                        <input
                          type="text"
                          value={item.load}
                          onChange={(e) => updateExerciseField(item.id, 'load', e.target.value)}
                          className="w-14 text-right font-bold text-cyan-600 dark:text-cyan-400 bg-transparent focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeExercise(item.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Remove exercise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {routineExercises.length === 0 && (
                <div className="p-8 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-400 text-xs">
                  No exercises added. Pick from the catalog on the right.
                </div>
              )}
            </div>
          </div>

          {/* Right: Quick Catalog Picker */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Add Movement</h3>
              <span className="text-xs text-slate-400">Library</span>
            </div>

            <Card className="p-3.5 bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800">
              
              {/* Search & Pills */}
              <div className="space-y-2 mb-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search exercise..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
                  {muscleFilters.map(m => (
                    <button
                      key={m}
                      onClick={() => setSelectedMuscle(m)}
                      className={`px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                        selectedMuscle === m
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable List */}
              <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredCatalog.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => addExercise(ex)}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-transparent dark:border-slate-800/60 text-xs flex items-center justify-between transition-all group"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 block group-hover:text-cyan-500 transition-colors">
                        {ex.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {ex.muscleGroup.split(' ')[0]} &bull; {ex.equipment}
                      </span>
                    </div>
                    <span className="p-1 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-500 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))}
              </div>

            </Card>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};
