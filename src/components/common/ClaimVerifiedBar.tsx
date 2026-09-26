import React from 'react';
import { ShieldCheck, AlertCircle, TrendingUp, Info } from 'lucide-react';

interface ClaimVerifiedBarProps {
  skill: string;
  category?: string;
  selfClaim: number; // 1 to 5
  demonstrated: number; // 1 to 5
  confidence: number; // 0 to 100%
  required?: number; // 1 to 5
  importance?: 'HIGH' | 'MEDIUM' | 'LOW';
  showDetails?: boolean;
  onActionClick?: () => void;
  actionLabel?: string;
}

export const ClaimVerifiedBar: React.FC<ClaimVerifiedBarProps> = ({
  skill,
  category,
  selfClaim,
  demonstrated,
  confidence,
  required = 4.0,
  importance,
  showDetails = true,
  onActionClick,
  actionLabel,
}) => {
  const selfPercent = Math.min(100, Math.max(0, (selfClaim / 5) * 100));
  const demonstratedPercent = Math.min(100, Math.max(0, (demonstrated / 5) * 100));
  const requiredPercent = Math.min(100, Math.max(0, (required / 5) * 100));

  const gap = Number((required - demonstrated).toFixed(1));
  const isMeetingTarget = demonstrated >= required;
  const isHighGap = gap >= 1.0;

  // Claim inflation difference (what they claim vs what they can demonstrate)
  const claimDelta = Number((selfClaim - demonstrated).toFixed(1));

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 shadow-sm hover:border-slate-300 transition-all">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <h4 className="text-base font-semibold text-slate-900">{skill}</h4>
          {category && (
            <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              {category}
            </span>
          )}
          {importance && (
            <span
              className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                importance === 'HIGH'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : importance === 'MEDIUM'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {importance} Priority
            </span>
          )}
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              confidence >= 80
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : confidence >= 60
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
            title="Evidence Confidence based on assessment, project analysis & interview"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{confidence}% Confidence</span>
          </div>

          {onActionClick && actionLabel && (
            <button
              onClick={onActionClick}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>

      {/* Numerical Scores row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 mb-3 bg-slate-50/80 rounded-lg px-3 border border-slate-100 text-xs">
        <div>
          <span className="text-slate-500 block text-[11px]">Self-Claimed</span>
          <span className="font-semibold text-slate-800 text-sm">{selfClaim.toFixed(1)} <span className="text-slate-400 font-normal">/ 5</span></span>
          <span className="block text-[10px] text-amber-600 font-medium">Unverified self-report</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[11px]">Demonstrated</span>
          <span className={`font-bold text-sm ${isMeetingTarget ? 'text-emerald-700' : 'text-slate-900'}`}>
            {demonstrated.toFixed(1)} <span className="text-slate-400 font-normal">/ 5</span>
          </span>
          <span className="block text-[10px] text-emerald-600 font-medium">Objective evidence</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[11px]">Role Target</span>
          <span className="font-semibold text-slate-700 text-sm">{required.toFixed(1)} <span className="text-slate-400 font-normal">/ 5</span></span>
          <span className="block text-[10px] text-slate-400">Target requirement</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[11px]">Skill Gap</span>
          <span
            className={`font-bold text-sm ${
              isMeetingTarget
                ? 'text-emerald-600'
                : isHighGap
                ? 'text-rose-600'
                : 'text-amber-600'
            }`}
          >
            {gap > 0 ? `-${gap.toFixed(1)}` : 'Verified Ready'}
          </span>
          {claimDelta > 0.4 && (
            <span className="block text-[10px] text-rose-500 font-medium">
              +{claimDelta.toFixed(1)} claim gap
            </span>
          )}
        </div>
      </div>

      {/* Visual Dual Bars */}
      <div className="space-y-2.5">
        {/* Self-claim bar */}
        <div>
          <div className="flex justify-between text-[11px] mb-1 text-slate-500">
            <span className="flex items-center gap-1 font-medium">
              <span>Self-Claimed:</span>
              <span className="text-slate-700 font-semibold">{selfClaim.toFixed(1)} / 5</span>
              <span className="text-slate-400 text-[10px]">(Self-reported — not verified)</span>
            </span>
            <span>{Math.round(selfPercent)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-amber-400/80 rounded-full transition-all duration-500"
              style={{ width: `${selfPercent}%` }}
            />
          </div>
        </div>

        {/* Demonstrated bar */}
        <div>
          <div className="flex justify-between text-[11px] mb-1 text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="text-slate-900 font-bold">Demonstrated:</span>
              <span className={`font-bold ${isMeetingTarget ? 'text-emerald-700' : 'text-indigo-600'}`}>
                {demonstrated.toFixed(1)} / 5
              </span>
              <span className="text-emerald-600 text-[10px] font-semibold">(Verified evidence)</span>
            </span>
            <span className="font-semibold text-slate-700">{Math.round(demonstratedPercent)}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
            {/* Target marker indicator */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
              style={{ left: `${requiredPercent}%` }}
              title={`Required level: ${required} / 5`}
            />
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isMeetingTarget
                  ? 'bg-emerald-500'
                  : isHighGap
                  ? 'bg-rose-500'
                  : 'bg-indigo-600'
              }`}
              style={{ width: `${demonstratedPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>0.0</span>
            <span className="text-slate-600 font-medium">Target ({required.toFixed(1)})</span>
            <span>5.0</span>
          </div>
        </div>
      </div>

      {/* Footer details */}
      {showDetails && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Evidence formula: 10% Claim + 50% Assessment + 20% Project + 20% Interview</span>
          </div>
          {gap > 0 && (
            <span className="text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded text-[11px]">
              Requires +{gap.toFixed(1)} to meet role standard
            </span>
          )}
        </div>
      )}
    </div>
  );
};
