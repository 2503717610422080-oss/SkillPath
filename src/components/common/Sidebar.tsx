import React from 'react';
import { useApp, AppPage } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileSearch,
  FileCheck2,
  PieChart,
  GitCompare,
  GraduationCap,
  Sparkles,
  FolderGit2,
  Mic,
  Award,
  FileText,
  UserCheck,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface NavItem {
  id: AppPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  group: 'core' | 'evidence' | 'prep' | 'account';
}

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, roleAlignment, skillGaps, learningPlan } = useApp();

  const highGapsCount = skillGaps.filter(g => g.priority === 'HIGH' && g.gap > 0).length;
  const activeLearningCount = learningPlan.filter(i => i.status !== 'VERIFIED').length;

  const navItems: NavItem[] = [
    // Core
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'core' },
    { id: 'job-analyzer', label: 'Job Analyzer', icon: FileSearch, group: 'core' },
    { id: 'skill-gaps', label: 'Skill Gaps', icon: GitCompare, badge: highGapsCount > 0 ? `${highGapsCount} high` : undefined, badgeColor: 'bg-rose-100 text-rose-700', group: 'core' },

    // Evidence & Assessment
    { id: 'baseline', label: 'Baseline Assessment', icon: FileCheck2, group: 'evidence' },
    { id: 'assessment-results', label: 'Assessment Results', icon: PieChart, group: 'evidence' },
    { id: 'projects', label: 'Project Evidence', icon: FolderGit2, group: 'evidence' },

    // Prep & Prove
    { id: 'learning', label: 'Personalized Learning', icon: GraduationCap, badge: activeLearningCount > 0 ? activeLearningCount : undefined, badgeColor: 'bg-indigo-100 text-indigo-700', group: 'prep' },
    { id: 'practice', label: 'Practice & Prove', icon: Sparkles, group: 'prep' },
    { id: 'interview', label: 'Mock Interview', icon: Mic, group: 'prep' },
    { id: 'interview-results', label: 'Interview Results', icon: Award, group: 'prep' },
    { id: 'resume', label: 'Resume Builder', icon: FileText, group: 'prep' },

    // Account
    { id: 'onboarding', label: 'Onboarding & Goals', icon: UserCheck, group: 'account' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 hidden md:flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Product Loop mini diagram */}
      <div className="p-4 m-3 bg-gradient-to-br from-indigo-50/80 via-slate-50 to-white rounded-xl border border-indigo-100/70">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Continuous Loop</span>
          <span className="text-[11px] font-bold text-slate-700">{roleAlignment.alignmentPercent}% Ready</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-tight mb-2.5">
          Self-Claim → Assessment → Gap → Learning → Prove → Interview
        </p>
        <button
          onClick={() => setCurrentPage('job-analyzer')}
          className="w-full text-center text-xs font-semibold py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>Run Next Loop Step</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-6 overflow-y-auto pb-6">
        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Core Navigation</span>
          <div className="mt-1 space-y-1">
            {navItems.filter(i => i.group === 'core').map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className={`w-4 h-4 ${currentPage === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Skill Evidence</span>
          <div className="mt-1 space-y-1">
            {navItems.filter(i => i.group === 'evidence').map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className={`w-4 h-4 ${currentPage === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Preparation & Verification</span>
          <div className="mt-1 space-y-1">
            {navItems.filter(i => i.group === 'prep').map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className={`w-4 h-4 ${currentPage === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Settings</span>
          <div className="mt-1 space-y-1">
            {navItems.filter(i => i.group === 'account').map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className={`w-4 h-4 ${currentPage === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Verification Formula summary in footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/60 text-[10px] text-slate-500">
        <div className="flex items-center gap-1 font-semibold text-slate-700 mb-1">
          <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
          <span>Verification Formula</span>
        </div>
        <p className="leading-tight">
          10% Self-Claim + 50% Test + 20% Project + 20% Interview
        </p>
      </div>
    </aside>
  );
};
