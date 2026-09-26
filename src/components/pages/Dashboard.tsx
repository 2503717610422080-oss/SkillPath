import React from 'react';
import { useApp } from '../../context/AppContext';
import { ClaimVerifiedBar } from '../common/ClaimVerifiedBar';
import {
  Target,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Mic,
  FileText,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    targetRole,
    userSkills,
    skillGaps,
    learningPlan,
    roleAlignment,
    resume,
    setCurrentPage,
    setSelectedSkillForProof,
  } = useApp();

  const topGaps = skillGaps.filter(g => g.gap > 0).slice(0, 3);
  const strongestSkills = [...userSkills].sort((a, b) => b.demonstratedScore - a.demonstratedScore).slice(0, 3);
  const weeklyLearning = learningPlan.slice(0, 3);
  const recentlyVerified = userSkills.filter(s => s.confidenceScore >= 75).slice(0, 4);

  // Resume completeness calculation
  let resumeScore = 0;
  if (resume.summary) resumeScore += 20;
  if (resume.education?.length) resumeScore += 20;
  if (resume.experience?.length) resumeScore += 20;
  if (resume.projects?.length) resumeScore += 25;
  if (resume.certifications?.length) resumeScore += 15;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner / Hero Metric Cards */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl text-white p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Evidence-Driven Preparation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Placement Readiness Overview
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Targeting <span className="text-white font-semibold">{targetRole?.roleTitle || 'Software Engineer'}</span> at{' '}
              <span className="text-white font-semibold">{targetRole?.company || 'Sample Technologies'}</span>.
              Comparing what you claim with what you have objectively proven.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10 text-center">
              <span className="text-xs text-slate-300 block font-medium">Role Alignment</span>
              <span className="text-2xl font-black text-emerald-400">{roleAlignment.alignmentPercent}%</span>
              <span className="text-[10px] text-slate-300 block mt-0.5">Based on demonstrated</span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10 text-center">
              <span className="text-xs text-slate-300 block font-medium">Active Gaps</span>
              <span className="text-2xl font-black text-amber-400">{roleAlignment.totalGaps}</span>
              <span className="text-[10px] text-slate-300 block mt-0.5">{roleAlignment.highPriorityGaps} high priority</span>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/10 text-center col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-300 block font-medium">Verified Skills</span>
              <span className="text-2xl font-black text-indigo-300">{roleAlignment.verifiedCount} / {userSkills.length}</span>
              <span className="text-[10px] text-slate-300 block mt-0.5">Confidence ≥ 70%</span>
            </div>
          </div>
        </div>

        {/* Quick action bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Next recommended milestone: Complete SQL Window Functions proof</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('baseline')}
              className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors shadow-sm"
            >
              Take Baseline Assessment
            </button>
            <button
              onClick={() => setCurrentPage('interview')}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors shadow-sm"
            >
              Start AI Mock Interview
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Claim vs Demonstrated Highlights & Top Gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top Gaps & Claim vs Demonstrated (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Primary Skill Gaps & Evidence</span>
              </h2>
              <p className="text-xs text-slate-500">
                Sorted by target role priority and verified deficit
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('skill-gaps')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View all ({skillGaps.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {topGaps.map(gapItem => {
              const fullSkill = userSkills.find(s => s.skillName === gapItem.skillName);
              if (!fullSkill) return null;
              return (
                <ClaimVerifiedBar
                  key={gapItem.skillName}
                  skill={fullSkill.skillName}
                  category={fullSkill.category}
                  selfClaim={fullSkill.selfClaimScore}
                  demonstrated={fullSkill.demonstratedScore}
                  confidence={fullSkill.confidenceScore}
                  required={fullSkill.requiredLevel}
                  importance={fullSkill.importance}
                  actionLabel="Prove Skill"
                  onActionClick={() => {
                    setSelectedSkillForProof({ skillName: fullSkill.skillName });
                    setCurrentPage('practice');
                  }}
                />
              );
            })}
          </div>

          {/* Strongest Skills */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Strongest Demonstrated Skills</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {strongestSkills.map(skill => (
                <div key={skill.skillName} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-slate-800 text-xs">{skill.skillName}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {skill.confidenceScore}% conf
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-slate-900">{skill.demonstratedScore.toFixed(1)}</span>
                    <span className="text-xs text-slate-400">/ 5.0</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Self: {skill.selfClaimScore.toFixed(1)} | Req: {skill.requiredLevel.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Learning Plan, Interview, Resume Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* This Week's Learning Plan */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>This Week's Learning Plan</span>
              </h3>
              <button
                onClick={() => setCurrentPage('learning')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Plan ({learningPlan.length})
              </button>
            </div>

            <div className="space-y-3">
              {weeklyLearning.map(item => (
                <div key={item.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
                        {item.skill}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-900 mt-0.5">{item.topic}</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 shrink-0">
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-1">{item.reason}</p>
                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.estimatedTime}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedSkillForProof({ skillName: item.skill, topic: item.topic });
                        setCurrentPage('practice');
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>Prove Skill</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Mock Interview Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Mic className="w-4 h-4 text-emerald-600" />
                <span>Adaptive Mock Interview</span>
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                AI Driven
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3.5">
              Targeted simulation asking role-tailored technical & scenario questions.
            </p>
            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-100 mb-3.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Target Role:</span>
                <span className="font-semibold text-slate-800">{targetRole?.roleTitle || 'Software Engineer'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Company Context:</span>
                <span className="font-semibold text-slate-800">{targetRole?.company || 'Sample Technologies'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Focus Areas:</span>
                <span className="font-semibold text-indigo-600">SQL, Concurrency, DSA</span>
              </div>
            </div>
            <button
              onClick={() => setCurrentPage('interview')}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Mic className="w-3.5 h-3.5 text-emerald-400" />
              <span>Launch Mock Interview Session</span>
            </button>
          </div>

          {/* Resume Completeness */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Resume Alignment</span>
              </h3>
              <span className="text-xs font-bold text-slate-800">{resumeScore}% Complete</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${resumeScore}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">SkillPath Resume Match Score:</span>
              <span className="font-bold text-indigo-700">{resume?.tailorAnalysis?.matchScore || 74}/100</span>
            </div>
            <button
              onClick={() => setCurrentPage('resume')}
              className="mt-3 w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Tailor Resume with Verified Skills</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Recently Verified Badges */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Recently Verified Skills</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentlyVerified.map(skill => (
                <div
                  key={skill.skillName}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50/80 border border-emerald-200 rounded-lg text-xs text-emerald-800"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold">{skill.skillName}</span>
                  <span className="text-[11px] text-emerald-600">({skill.demonstratedScore.toFixed(1)}/5)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
