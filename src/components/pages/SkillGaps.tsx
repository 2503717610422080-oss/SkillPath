import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClaimVerifiedBar } from '../common/ClaimVerifiedBar';
import { PriorityLevel } from '../../types';
import {
  GitCompare,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Info
} from 'lucide-react';

export const SkillGaps: React.FC = () => {
  const {
    skillGaps,
    userSkills,
    targetRole,
    setCurrentPage,
    setSelectedSkillForProof,
  } = useApp();

  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredGaps = skillGaps.filter((g) => {
    if (filterPriority === 'ALL') return true;
    return g.priority === filterPriority;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                Gap Matrix Engine
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {targetRole?.roleTitle || 'Software Engineer'} Requirements
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-indigo-600" />
              <span>Target Role Skill Gaps</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Formula: <code className="text-slate-700 font-mono bg-slate-100 px-1.5 py-0.5 rounded">Gap = Required Level - Demonstrated Level</code>.
              Priority is weighted by gap deficit and job description importance.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('learning')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 self-start sm:self-center shadow-sm"
          >
            <span>Generate Learning Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter and View toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600 mr-1">Filter Priority:</span>
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  filterPriority === p
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Matrix Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Dual Bars
            </button>
          </div>
        </div>
      </div>

      {/* MATRIX TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Skill & Category</th>
                  <th className="py-3 px-3 text-center">Demonstrated (0-100 / 5)</th>
                  <th className="py-3 px-3 text-center">Required Target</th>
                  <th className="py-3 px-3 text-center">Deficit (Gap)</th>
                  <th className="py-3 px-3 text-center">Priority</th>
                  <th className="py-3 px-3 text-center">Evidence Confidence</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredGaps.map((item) => {
                  const currentScore100 = Math.round((item.currentLevel / 5) * 100);
                  const requiredScore100 = Math.round((item.requiredLevel / 5) * 100);
                  const gapScore100 = Math.max(0, requiredScore100 - currentScore100);

                  return (
                    <tr key={item.skillName} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 text-sm">{item.skillName}</div>
                        <span className="text-[10px] uppercase font-semibold text-slate-500 px-1.5 py-0.5 bg-slate-100 rounded">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="font-bold text-slate-900">{currentScore100} <span className="text-[10px] text-slate-400 font-normal">/ 100</span></div>
                        <div className="text-[10px] text-slate-500">({item.currentLevel.toFixed(1)} / 5)</div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="font-bold text-slate-700">{requiredScore100} <span className="text-[10px] text-slate-400 font-normal">/ 100</span></div>
                        <div className="text-[10px] text-slate-500">({item.requiredLevel.toFixed(1)} / 5)</div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        {item.gap > 0 ? (
                          <div className="inline-flex items-center gap-1 font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                            <TrendingDown className="w-3 h-3" />
                            <span>{gapScore100} (-{item.gap.toFixed(1)})</span>
                          </div>
                        ) : (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">
                            Verified Ready
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            item.priority === 'HIGH'
                              ? 'bg-rose-100 text-rose-800'
                              : item.priority === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{item.confidence}%</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedSkillForProof({ skillName: item.skillName });
                            setCurrentPage('practice');
                          }}
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-colors text-xs inline-flex items-center gap-1"
                        >
                          <span>Prove Skill</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARDS / BARS VIEW */
        <div className="space-y-3.5">
          {filteredGaps.map((item) => {
            const fullSkill = userSkills.find((s) => s.skillName === item.skillName);
            if (!fullSkill) return null;
            return (
              <ClaimVerifiedBar
                key={item.skillName}
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
      )}

      {/* Explanatory callout */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-800">Dynamic Reassessment & Priority Ranking</p>
          <p className="mt-0.5 leading-relaxed text-slate-500">
            Completing rapid assessments via <strong>Prove Skill</strong> or answering technical questions in the <strong>AI Mock Interview</strong> updates your demonstrated score in real-time, shrinks the gap, and dynamically reprioritizes your learning path.
          </p>
        </div>
      </div>
    </div>
  );
};
