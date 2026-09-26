import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  RotateCcw,
  ShieldCheck,
  Building2,
  Briefcase,
  Sparkles,
  LogOut,
  User,
  LogIn
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    targetRole,
    roleAlignment,
    resetAllDemoData,
    profile,
    currentPage,
    setCurrentPage,
    notification,
    firebaseUser,
    loginWithGoogle,
    logout,
  } = useApp();

  const isGuestOrAnon = !firebaseUser || firebaseUser.isAnonymous;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-lg flex items-center gap-1.5">
                SkillPath
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Verified
                </span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium leading-none hidden sm:block">
                Claimed vs. Demonstrated Skill Platform
              </p>
            </div>
          </button>
        </div>

        {/* Center Target Role info */}
        <div className="hidden md:flex items-center gap-3 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-semibold text-slate-800">{targetRole?.roleTitle || 'Software Engineer'}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-600">{targetRole?.company || 'Sample Technologies'}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{roleAlignment.alignmentPercent}% Alignment</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* If Guest/Anonymous, offer 1-click Link Google */}
          {isGuestOrAnon ? (
            <button
              onClick={() => loginWithGoogle()}
              title="Save all your assessments and data permanently with Google"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg transition-colors shadow-2xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="hidden sm:inline">Link Google</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Session</span>
            </div>
          )}

          {/* Quick Demo Reset */}
          <button
            onClick={() => resetAllDemoData()}
            title="Reset to default benchmark demo state"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden lg:inline">Reset Demo</span>
          </button>

          {/* User Profile Pill */}
          <button
            onClick={() => setCurrentPage('onboarding')}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-lg hover:bg-slate-100 text-left transition-colors"
          >
            {profile.photoURL || firebaseUser?.photoURL ? (
              <img
                src={profile.photoURL || firebaseUser?.photoURL || ''}
                alt="Profile"
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                {profile.displayName?.charAt(0) || profile.name?.charAt(0) || 'A'}
              </div>
            )}
            <div className="hidden lg:block text-xs">
              <span className="font-semibold text-slate-800 block leading-tight max-w-[120px] truncate">
                {profile.displayName || profile.name || 'Alex Morgan'}
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">
                {isGuestOrAnon ? 'Guest' : 'Candidate'}
              </span>
            </div>
          </button>

          {/* Logout or Switch Account */}
          <button
            onClick={() => logout()}
            title="Sign out of SkillPath"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="bg-slate-900 text-white text-xs px-4 py-2 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top duration-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}
    </header>
  );
};
