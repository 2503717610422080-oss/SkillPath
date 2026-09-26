import React from 'react';
import { useApp } from '../../context/AppContext';
import { ClaimVerifiedBar } from '../common/ClaimVerifiedBar';
import {
  PieChart,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export const AssessmentResults: React.FC = () => {
  const {
    lastAssessment,
    userSkills,
    roleAlignment,
    setCurrentPage,
    setSelectedSkillForProof
  } = useApp();

  const totalScore = lastAssessment?.scoreOutOf100 || 68;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Assessment Completed & Verified</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Baseline Assessment Results
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
              Objective benchmark results are now integrated with your evidence profile (50% test weighting).
              Notice the discrepancy between self-claims and demonstrated performance.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Assessment Score</span>
              <span className="text-3xl font-black text-slate-900">{totalScore}%</span>
              <span className="text-[10px] text-emerald-600 font-semibold block">Objective baseline</span>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Role Alignment</span>
              <span className="text-3xl font-black text-emerald-600">{roleAlignment.alignmentPercent}%</span>
              <span className="text-[10px] text-slate-500 font-semibold block">Target ready</span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setCurrentPage('baseline')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Baseline Assessment</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('skill-gaps')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              Analyze Skill Gaps
            </button>
            <button
              onClick={() => setCurrentPage('learning')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>View Personalized Learning Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Claim vs Demonstrated Skill Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Claim vs. Demonstrated Skills
            </h2>
            <p className="text-xs text-slate-500">
              Self-reported claims juxtaposed against verified evidence across every tested domain.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
            7 Verified Competencies
          </span>
        </div>

        <div className="space-y-3.5">
          {userSkills.map((skill) => (
            <ClaimVerifiedBar
              key={skill.skillName}
              skill={skill.skillName}
              category={skill.category}
              selfClaim={skill.selfClaimScore}
              demonstrated={skill.demonstratedScore}
              confidence={skill.confidenceScore}
              required={skill.requiredLevel}
              importance={skill.importance}
              actionLabel="Target in Learning"
              onActionClick={() => {
                setSelectedSkillForProof({ skillName: skill.skillName });
                setCurrentPage('learning');
              }}
            />
          ))}
        </div>
      </div>

      {/* Detailed Question Answers (if available) */}
      {lastAssessment?.answers && lastAssessment.answers.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Question-by-Question Evaluation Details</span>
          </h3>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-2 space-y-3">
            {lastAssessment.answers.map((ans, idx) => (
              <div key={idx} className="pt-3 first:pt-0">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-400">Q{idx + 1}</span>
                    <span className="font-semibold text-slate-800">{ans.skill}</span>
                    <span className="text-[10px] text-slate-400 uppercase">({ans.type})</span>
                  </div>
                  <span
                    className={`font-bold text-xs px-2 py-0.5 rounded ${
                      ans.scoreOutOf100 >= 75
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {ans.scoreOutOf100} / 100
                  </span>
                </div>
                {ans.feedback && (
                  <p className="text-[11px] text-slate-500 mt-1 italic leading-relaxed">
                    {ans.feedback}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
