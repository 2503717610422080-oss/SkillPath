import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { auth, signInAnonymously } from '../../firebase';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Mail,
  UserCheck
} from 'lucide-react';

export const Login: React.FC = () => {
  const { setCurrentPage, showNotification, profile } = useApp();
  const [email, setEmail] = useState('alex.morgan@sampletech.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleDemoSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInAnonymously(auth);
    } catch (e) {
      console.log('Demo mode fallback');
    }
    showNotification('Logged in as benchmark candidate: Alex Morgan');
    setIsSigningIn(false);
    setCurrentPage('dashboard');
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    handleDemoSignIn();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200 mb-2">
            <Compass className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            SkillPath
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Evidence-driven placement preparation platform bridging the gap between claimed & demonstrated skills.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
          {/* Quick Demo Access Button */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Placement Candidate Demo
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-snug">
              Pre-populated with benchmark profile for <strong>Alex Morgan</strong> targeting <strong>Software Engineer</strong> at <strong>Sample Technologies</strong>.
            </p>
            <button
              onClick={handleDemoSignIn}
              disabled={isSigningIn}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-indigo-200" />
              <span>{isSigningIn ? 'Loading Session...' : 'Instant 1-Click Demo Login'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              Or Sign In with Credentials
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          {/* Regular Login Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Student Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Sign In to SkillPath</span>
            </button>
          </form>
        </div>

        {/* Verification Guarantee */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Multi-factor Evidence Formula Enabled</span>
        </div>
      </div>
    </div>
  );
};
