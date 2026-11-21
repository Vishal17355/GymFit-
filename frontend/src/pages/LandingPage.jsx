import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  User,
  Users,
  Building2,
  Dumbbell,
  Home,
  Utensils,
  BookOpen,
  TrendingUp,
  Scale,
  ClipboardList,
  Apple,
  LineChart,
  Calendar,
  Layers,
  CreditCard,
  BarChart3,
  MapPin,
  Check,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Zap,
  Target,
  Clock
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('trainer');
  const featuresRef = useRef(null);

  const handleRoleSelect = (roleKey) => {
    // When clicking Member, navigate directly to Member Dashboard page
    if (roleKey === 'member') {
      navigate('/dashboard/member');
      return;
    }

    setSelectedRole(roleKey);
    // Smooth scroll down to feature section
    setTimeout(() => {
      featuresRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  // 1. Three Main Roles Configuration
  const roles = [
    {
      key: 'member',
      title: 'Member',
      description: 'Your personal fitness journey.',
      icon: User,
      accentColor: 'cyan',
      portalPath: '/dashboard/member',
      portalLabel: 'Launch Member Portal'
    },
    {
      key: 'trainer',
      title: 'Trainer',
      description: 'Manage and guide your clients.',
      icon: Users,
      accentColor: 'purple',
      portalPath: '/dashboard/trainer',
      portalLabel: 'Launch Trainer Portal'
    },
    {
      key: 'owner',
      title: 'Gym Owner',
      description: 'Manage your gym operations.',
      icon: Building2,
      accentColor: 'amber',
      portalPath: '/dashboard/owner',
      portalLabel: 'Launch Owner Portal'
    }
  ];

  // 2. Exact Features per Role
  const roleFeatures = {
    member: [
      {
        icon: Dumbbell,
        title: 'Workout Plans',
        description: 'Structured routines tailored for your specific fitness goals.'
      },
      {
        icon: Home,
        title: 'Home Workouts',
        description: 'Effective bodyweight and minimal-equipment routines anywhere.'
      },
      {
        icon: Utensils,
        title: 'Diet Plans',
        description: 'Targeted nutrition guidelines and daily macro targets.'
      },
      {
        icon: BookOpen,
        title: 'Exercise Library',
        description: 'Complete movement directory with biomechanical coaching cues.'
      },
      {
        icon: TrendingUp,
        title: 'Progress Tracking',
        description: 'Log progressive overload, set completions, and personal records.'
      },
      {
        icon: Scale,
        title: 'Body Metrics',
        description: 'Track weight changes, body fat percentage, and composition.'
      }
    ],
    trainer: [
      {
        icon: Users,
        title: 'Client Management',
        description: 'Centralized athlete roster with profiles and attendance history.'
      },
      {
        icon: ClipboardList,
        title: 'Workout Assignment',
        description: 'Prescribe custom split routines directly to member dashboards.'
      },
      {
        icon: Apple,
        title: 'Diet Guidance',
        description: 'Deliver nutrition strategies and dietary recommendations.'
      },
      {
        icon: LineChart,
        title: 'Client Progress',
        description: 'Audit training completion rates, consistency, and strength gains.'
      },
      {
        icon: Calendar,
        title: 'Training Schedule',
        description: 'Organize 1-on-1 coaching appointments and group class sessions.'
      },
      {
        icon: Layers,
        title: 'Exercise Programs',
        description: 'Build reusable workout templates and periodized programming blocks.'
      }
    ],
    owner: [
      {
        icon: User,
        title: 'Member Management',
        description: 'Complete directory of active, pending, and renewed memberships.'
      },
      {
        icon: CreditCard,
        title: 'Membership Plans',
        description: 'Configure flexible pricing tiers, recurring billing, and passes.'
      },
      {
        icon: Users,
        title: 'Staff Management',
        description: 'Manage trainers, front-desk staff, roles, and system permissions.'
      },
      {
        icon: CreditCard,
        title: 'Payments and Billing',
        description: 'Track automated recurring revenue, invoices, and billing health.'
      },
      {
        icon: BarChart3,
        title: 'Gym Analytics',
        description: 'Real-time facility headcount, peak traffic, and retention rates.'
      },
      {
        icon: MapPin,
        title: 'Multi-Branch Management',
        description: 'Centralized administration across all gym locations and facilities.'
      }
    ]
  };

  const currentRoleData = roles.find((r) => r.key === selectedRole) || roles[0];
  const activeFeatures = roleFeatures[selectedRole] || [];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <section className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <div className="grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col items-start justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-cyan-700 dark:text-cyan-300">GymFit for members and coaches</p>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.04] tracking-tight">Food, training and progress in one place.</h1>
            <p className="mt-5 max-w-lg text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">Log your meals, follow a workout that fits your day, and see how your habits change over time.</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link to="/dashboard/member" className="rounded-xl bg-slate-900 hover:bg-slate-700 dark:bg-cyan-300 dark:text-slate-950 text-white px-4 py-3 text-sm font-bold inline-flex items-center gap-2">Open member dashboard <ArrowRight size={16} /></Link>
              <Link to="/bicep-curl" className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-3 text-sm font-bold">See a 3D exercise</Link>
            </div>
          </div>
          <nav aria-label="Explore GymFit" className="space-y-2.5">
            {[
              ['/member/nutrition-diary', 'Nutrition diary', 'Record meals and review your totals', Utensils],
              ['/home-workout', 'Home workouts', 'Plan sessions around your equipment', Dumbbell],
              ['/progress', 'Progress', 'Review training and measurements', LineChart]
            ].map(([to, title, description, Icon]) => <Link key={to} to={to} className="gym-feature-link">
              <div className="flex items-center gap-3"><span className="rounded-xl bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200 p-2.5"><Icon size={19} aria-hidden="true" /></span>
                <div><span className="block font-bold">{title}</span><span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</span></div>
              </div><ArrowRight size={16} className="shrink-0 text-slate-500" aria-hidden="true" />
            </Link>)}
          </nav>
        </div>
      </section>
      {/* 2. THREE MAIN ROLE CARDS (Equal size, interactive, clickable) */}
      <section className="py-10 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.key;
            const isMember = role.key === 'member';

            const cardContent = (
              <>
                <div>
                  {/* Top Bar with Icon and Selected Status Indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isMember || isSelected
                          ? 'bg-cyan-500 text-slate-950 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {isMember ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-100/70 dark:bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-200/60 dark:border-cyan-800/60">
                        <span>Open Dashboard</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    ) : isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-100/70 dark:bg-cyan-950/60 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium group-hover:text-slate-600">
                        Click to view
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {role.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold">
                  <span className={isMember || isSelected ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500'}>
                    {isMember ? 'Launch Member Dashboard' : isSelected ? 'Viewing Features' : 'Select Role'}
                  </span>
                  {isMember ? (
                    <ArrowRight className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isSelected ? 'text-cyan-600 dark:text-cyan-400 rotate-180' : 'text-slate-400'
                      }`}
                    />
                  )}
                </div>
              </>
            );

            // Member card navigates directly to the Member Dashboard page
            if (isMember) {
              return (
                <Link
                  key={role.key}
                  to="/dashboard/member"
                  className="group text-left p-6 rounded-2xl border border-cyan-500/80 dark:border-cyan-400/80 bg-cyan-50/20 dark:bg-cyan-950/20 hover:border-cyan-500 hover:ring-2 hover:ring-cyan-500/20 hover:shadow-md transition-all duration-200 cursor-pointer relative flex flex-col justify-between"
                >
                  {cardContent}
                </Link>
              );
            }

            return (
              <button
                key={role.key}
                type="button"
                onClick={() => handleRoleSelect(role.key)}
                className={`text-left p-6 rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-500 dark:border-cyan-400 bg-cyan-50/40 dark:bg-cyan-950/20 ring-2 ring-cyan-500/20 shadow-md transform -translate-y-1'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 shadow-sm'
                }`}
              >
                {cardContent}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3 & 4. INTERACTIVE FEATURE DISPLAY (Dynamic based on selected role) */}
      <section
        ref={featuresRef}
        className="py-12 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80 scroll-mt-14"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          {/* Section Header for Active Role */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  {currentRoleData.title} Features
                </span>
                <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  6 Core Capabilities
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Everything for the {currentRoleData.title}
              </h2>
            </div>

            <Link to={currentRoleData.portalPath}>
              <Button size="sm" icon={ArrowRight} iconPosition="right">
                {currentRoleData.portalLabel}
              </Button>
            </Link>
          </div>

          {/* Clean Responsive Feature Grid (6 features) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeFeatures.map((feat, idx) => {
              const FeatIcon = feat.icon;

              return (
                <div
                  key={`${selectedRole}-${idx}`}
                  className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center mb-3">
                      <FeatIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {feat.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. ADDITIONAL INFORMATION: Why Choose GymFit */}
      <section className="py-14 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Why Choose GymFit?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Designed to remove operational friction and keep athletes focused on progress.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Unified System</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              One account connects members, personal trainers, and gym owners seamlessly.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
              <Target className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Progress-Focused</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Target progressive overload, set completions, and body recomposition metrics.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Fast &amp; Simple</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Fast check-in and quick logging between sets with zero clutter or friction.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Multi-Branch</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Complete data privacy and centralized control across multiple gym locations.
            </p>
          </div>
        </div>
      </section>

      {/* 5. ADDITIONAL INFORMATION: How GymFit Works */}
      <section className="py-12 bg-slate-50/60 dark:bg-slate-900/30 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              How GymFit Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Three straightforward steps to start training and managing better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left">
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">01</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                Choose Your Role
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Sign in as a Member, Trainer, or Gym Owner to access your dedicated workspace.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left">
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">02</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                Program &amp; Assign
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Access curated workout routines, build client splits, or configure gym memberships.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left">
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">03</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                Track &amp; Grow
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Log completed workouts, monitor personal records, and optimize facility operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ADDITIONAL INFORMATION: Final Get Started Section */}
      <section className="py-14 max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Ready to Start with GymFit?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Experience seamless fitness tracking and gym operations. Get started in seconds with our interactive demo.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/register">
            <Button size="lg" icon={ArrowRight} iconPosition="right">
              Create Free Account
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Sign In to Workspaces
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
