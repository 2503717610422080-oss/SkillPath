import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  RotateCcw,
  Target,
  Sparkles,
  ShieldCheck,
  Building2,
  Briefcase
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
  } = useApp();

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
          {/* Quick Demo Reset */}
          <button
            onClick={() => resetAllDemoData()}
            title="Reset to default benchmark demo state"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          {/* User Profile */}
          <button
            onClick={() => setCurrentPage('onboarding')}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg hover:bg-slate-100 text-left transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              {profile.displayName?.charAt(0) || 'A'}
            </div>
            <div className="hidden lg:block text-xs">
              <span className="font-semibold text-slate-800 block leading-tight">{profile.displayName || 'Alex Morgan'}</span>
              <span className="text-[10px] text-slate-400 block leading-tight">Candidate</span>
            </div>
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
