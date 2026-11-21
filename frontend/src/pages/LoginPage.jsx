import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Card, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthMockContext';
import { Dumbbell, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('MEMBER');
  const [email, setEmail] = useState('alex.rivera@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const roleCredentials = {
    MEMBER: { email: 'alex.rivera@example.com', name: 'Alex Rivera', roleTitle: 'Member', route: '/dashboard/member' },
    TRAINER: { email: 'marcus.vance@apexfit.com', name: 'Marcus Vance', roleTitle: 'Trainer', route: '/dashboard/trainer' },
    GYM_OWNER: { email: 'eleanor@apexfit.com', name: 'Eleanor Sterling', roleTitle: 'Owner', route: '/dashboard/owner' },
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setEmail(roleCredentials[role].email);
    setPassword('secret_pass_2026');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(selectedRole);
      setLoading(false);
      navigate(roleCredentials[selectedRole].route);
    }, 250);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gym-dark transition-colors">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-sm">
          
          <div className="text-center mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Sign In to Workspace
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select persona to test role-specific features
            </p>
          </div>

          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Clean Segmented Tab Control */}
            <div className="p-1 m-3 mb-0 rounded-lg bg-slate-100 dark:bg-slate-950 flex items-center text-xs">
              <button
                type="button"
                onClick={() => handleRoleSelect('MEMBER')}
                className={`flex-1 py-1 rounded-md font-semibold transition-all ${
                  selectedRole === 'MEMBER'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('TRAINER')}
                className={`flex-1 py-1 rounded-md font-semibold transition-all ${
                  selectedRole === 'TRAINER'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Trainer
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('GYM_OWNER')}
                className={`flex-1 py-1 rounded-md font-semibold transition-all ${
                  selectedRole === 'GYM_OWNER'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Owner
              </button>
            </div>

            <CardBody className="p-5">
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                <Input
                  label="Email"
                  type="email"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <span className="text-[11px] text-slate-400">
                    Signing in as <strong className="text-slate-700 dark:text-slate-200">{roleCredentials[selectedRole].name}</strong>
                  </span>
                  <a href="#" className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                    Forgot?
                  </a>
                </div>

                <Button
                  type="submit"
                  size="md"
                  loading={loading}
                  className="w-full mt-2"
                >
                  Enter Workspace
                </Button>

              </form>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
                New facility?{' '}
                <Link to="/register" className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                  Register tenant
                </Link>
              </div>
            </CardBody>
          </Card>

        </div>
      </div>
    </div>
  );
};
