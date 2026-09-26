import React from 'react';
import { useApp } from '../../context/AppContext';
import { ClaimVerifiedBar } from '../common/ClaimVerifiedBar';
import {
  Award,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Mic,
  RotateCcw
} from 'lucide-react';

export const InterviewResults: React.FC = () => {
  const {
    lastInterviewEvaluation,
    targetRole,
    userSkills,
    setCurrentPage,
    setSelectedSkillForProof,
  } = useApp();

  const evalData = lastInterviewEvaluation?.evaluation || {
    overallScore: 78,
    technicalScore: 75,
    problemSolvingScore: 80,
    communicationScore: 85,
    projectDepthScore: 72,
    roleRelevanceScore: 78,
    summary:
      'Candidate communicated clearly and broke down problems effectively. Showed depth in core Java architecture, with opportunities for improvement in relational database lock escalation and transaction isolation levels.',
    strengths: [
      'Strong logical breakdown and algorithmic structure',
      'Articulate communication of architectural trade-offs',
      'Honest acknowledgment of edge case limitations',
    ],
    weakAreas: [
      {
        skill: 'SQL',
        score: 64,
        reason: 'Did not articulate transaction isolation levels (READ COMMITTED vs SERIALIZABLE) under concurrent updates.',
        suggestedTopic: 'Complex Window Functions & Nested JOIN Optimization',
      },
      {
        skill: 'Java',
        score: 70,
        reason: 'Could elaborate deeper on JVM garbage collection pauses and volatile memory model guarantees.',
        suggestedTopic: 'Java Memory Model, Volatile & Concurrency Primitives',
      },
    ],
  };

  const handleImproveClick = (topicName: string, skill: string) => {
    setSelectedSkillForProof({
      skillName: skill,
      topic: topicName,
    });
    // Open personalized learning page
    setCurrentPage('learning');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Interview Completed & Evaluated</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Mock Interview Results
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
              Hiring committee evaluation for <strong className="text-slate-800">{targetRole?.roleTitle || 'Software Engineer'}</strong> at{' '}
              <strong className="text-slate-800">{targetRole?.company || 'Sample Technologies'}</strong>.
              Weighted at 20% into your verified demonstrated scores.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Overall Score</span>
              <span className="text-3xl font-black text-indigo-600">{evalData.overallScore} <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
              <span className="text-[10px] text-emerald-600 font-semibold block">Hiring Committee Bar</span>
            </div>
          </div>
        </div>

        {/* Committee 5-dimension scorecard */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-100 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Technical</span>
            <span className="text-xl font-black text-slate-900">{evalData.technicalScore}%</span>
            <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${evalData.technicalScore}%` }} />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Problem Solving</span>
            <span className="text-xl font-black text-slate-900">{evalData.problemSolvingScore}%</span>
            <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${evalData.problemSolvingScore}%` }} />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Communication</span>
            <span className="text-xl font-black text-slate-900">{evalData.communicationScore}%</span>
            <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${evalData.communicationScore}%` }} />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Project Depth</span>
            <span className="text-xl font-black text-slate-900">{evalData.projectDepthScore}%</span>
            <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-600 h-full rounded-full" style={{ width: `${evalData.projectDepthScore}%` }} />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Role Relevance</span>
            <span className="text-xl font-black text-slate-900">{evalData.roleRelevanceScore}%</span>
            <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${evalData.roleRelevanceScore}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Executive Interview Summary
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {evalData.summary}
        </p>

        {evalData.strengths && evalData.strengths.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-semibold text-emerald-700 block mb-1.5">Key Strengths Demonstrated:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {evalData.strengths.map((s, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg text-xs text-emerald-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* WEAK AREAS (With Mandatory Improve button linking to Learning) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Targeted Weak Areas Identified</span>
            </h3>
            <p className="text-xs text-slate-500">
              Each weak area links directly to personalized remediation modules in your learning plan.
            </p>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg">
            {evalData.weakAreas.length} Areas Needing Remediation
          </span>
        </div>

        <div className="space-y-3">
          {evalData.weakAreas.map((area, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{area.skill}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Interview Score: {area.score}/100
                  </span>
                </div>
                <p className="text-xs text-slate-700">{area.reason}</p>
                <div className="text-[11px] text-indigo-700 font-medium flex items-center gap-1 mt-1">
                  <BookOpen className="w-3 h-3" />
                  <span>Suggested Module: {area.suggestedTopic}</span>
                </div>
              </div>

              {/* The Improve Button must open the relevant learning topic */}
              <button
                onClick={() => handleImproveClick(area.suggestedTopic, area.skill)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-center shadow-sm"
              >
                <span>Improve</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation to Dashboard & Gaps */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentPage('interview')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Practice Another Mock Interview</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('skill-gaps')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
          >
            Inspect Updated Gaps
          </button>
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Back to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
