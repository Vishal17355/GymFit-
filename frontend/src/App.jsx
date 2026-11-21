import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthMockProvider } from './context/AuthMockContext';
import { RouteLoadingBoundary } from './components/common/RouteLoadingBoundary';

// Pages
import { LandingPage } from './pages/LandingPage';
const LoginPage = lazy(() => import('./pages/LoginPage').then((page) => ({ default: page.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((page) => ({ default: page.RegisterPage })));
const MemberDashboard = lazy(() => import('./pages/MemberDashboard').then((page) => ({ default: page.MemberDashboard })));
const TrainerDashboard = lazy(() => import('./pages/TrainerDashboard').then((page) => ({ default: page.TrainerDashboard })));
const GymOwnerDashboard = lazy(() => import('./pages/GymOwnerDashboard').then((page) => ({ default: page.GymOwnerDashboard })));
const ExerciseLibrary = lazy(() => import('./pages/ExerciseLibrary').then((page) => ({ default: page.ExerciseLibrary })));
const WorkoutPlanBuilder = lazy(() => import('./pages/WorkoutPlanBuilder').then((page) => ({ default: page.WorkoutPlanBuilder })));
const ProgressTracking = lazy(() => import('./pages/ProgressTracking').then((page) => ({ default: page.ProgressTracking })));
const BicepCurlAnimationPage = lazy(() => import('./pages/BicepCurlAnimationPage').then((page) => ({ default: page.BicepCurlAnimationPage })));
const InclineDumbbellPressPage = lazy(() => import('./pages/InclineDumbbellPressPage').then((page) => ({ default: page.InclineDumbbellPressPage })));
const DietPlannerPage = lazy(() => import('./pages/DietPlannerPage').then((page) => ({ default: page.DietPlannerPage })));
const HomeWorkoutDashboard = lazy(() => import('./pages/HomeWorkout/HomeWorkoutDashboard'));
const NutritionDiaryPage = lazy(() => import('./pages/NutritionDiaryPage'));
const NutritionToolsPage = lazy(() => import('./pages/NutritionToolsPage'));

export function App() {
  return (
    <ThemeProvider>
      <AuthMockProvider>
        <BrowserRouter>
          <RouteLoadingBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Role Dashboards */}
            <Route path="/dashboard/member" element={<MemberDashboard />} />
            <Route path="/dashboard/trainer" element={<TrainerDashboard />} />
            <Route path="/dashboard/owner" element={<GymOwnerDashboard />} />

            {/* Core Fitness & Operational Features */}
            <Route path="/bicep-curl" element={<BicepCurlAnimationPage />} />
            <Route path="/exercise/bicep-curl" element={<BicepCurlAnimationPage />} />
            <Route path="/incline-dumbbell-press" element={<InclineDumbbellPressPage />} />
            <Route path="/exercise/incline-dumbbell-press" element={<InclineDumbbellPressPage />} />
            <Route path="/member/workout-plan" element={<WorkoutPlanBuilder />} />
            <Route path="/member/diet-plan" element={<DietPlannerPage />} />
            <Route path="/member/nutrition-diary" element={<NutritionDiaryPage />} />
            <Route path="/member/nutrition-tools" element={<NutritionToolsPage />} />
            <Route path="/home-workout" element={<HomeWorkoutDashboard />} />
            <Route path="/member/home-workout" element={<HomeWorkoutDashboard />} />
            <Route path="/diet-plan" element={<DietPlannerPage />} />
            <Route path="/exercises" element={<ExerciseLibrary />} />
            <Route path="/planner" element={<WorkoutPlanBuilder />} />
            <Route path="/progress" element={<ProgressTracking />} />

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </RouteLoadingBoundary>
        </BrowserRouter>
      </AuthMockProvider>
    </ThemeProvider>
  );
}

export default App;
