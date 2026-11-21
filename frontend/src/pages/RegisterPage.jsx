import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Card, CardBody } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthMockContext';
import { User, Building2, Mail, Lock } from 'lucide-react';

export const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [registerType, setRegisterType] = useState('MEMBER');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gymName: '',
    slug: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (registerType === 'OWNER') {
      login('GYM_OWNER');
      navigate('/dashboard/owner');
    } else {
      login('MEMBER');
      navigate('/dashboard/member');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gym-dark transition-colors">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Create Account
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select registration pathway
            </p>
          </div>

          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Account type switch */}
            <div className="p-1 m-3 mb-0 rounded-lg bg-slate-100 dark:bg-slate-950 flex items-center text-xs">
              <button
                type="button"
                onClick={() => setRegisterType('MEMBER')}
                className={`flex-1 py-1.5 rounded-md font-semibold transition-all ${
                  registerType === 'MEMBER'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Join as Member
              </button>
              <button
                type="button"
                onClick={() => setRegisterType('OWNER')}
                className={`flex-1 py-1.5 rounded-md font-semibold transition-all ${
                  registerType === 'OWNER'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Register Gym
              </button>
            </div>

            <CardBody className="p-5">
              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="First Name"
                    name="firstName"
                    placeholder="Alex"
                    required
                    onChange={handleChange}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    placeholder="Rivera"
                    required
                    onChange={handleChange}
                  />
                </div>

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  icon={Mail}
                  placeholder="alex@domain.com"
                  required
                  onChange={handleChange}
                />

                {registerType === 'OWNER' ? (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <Input
                      label="Gym Name"
                      name="gymName"
                      placeholder="Apex Fitness"
                      required
                      onChange={handleChange}
                    />
                    <Input
                      label="Subdomain"
                      name="slug"
                      placeholder="apex-fit"
                      required
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  <div className="pt-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Facility
                    </label>
                    <select className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500">
                      <option>Apex Fitness Hub &bull; Downtown</option>
                      <option>Apex Performance &bull; Westside</option>
                      <option>Iron Works Club</option>
                    </select>
                  </div>
                )}

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  icon={Lock}
                  placeholder="••••••••••••"
                  required
                  onChange={handleChange}
                />

                <Button
                  type="submit"
                  size="md"
                  className="w-full mt-2"
                >
                  Create {registerType === 'OWNER' ? 'Gym Tenant' : 'Member Account'}
                </Button>

              </form>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
                Already registered?{' '}
                <Link to="/login" className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                  Sign in
                </Link>
              </div>
            </CardBody>
          </Card>

        </div>
      </div>
    </div>
  );
};
