import React from 'react';
import { Loader2, CheckCircle2, AlertTriangle, RefreshCw, Inbox } from 'lucide-react';

export type AIStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

interface AIStateIndicatorProps {
  status: AIStatus;
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  className?: string;
}

export const AIStateIndicator: React.FC<AIStateIndicatorProps> = ({
  status,
  loadingMessage = 'Processing with Gemini Intelligence...',
  successMessage = 'Analysis complete and synced to profile.',
  errorMessage = 'Unable to complete AI evaluation. Please try again.',
  emptyMessage = 'No data available to analyze yet.',
  onRetry,
  className = '',
}) => {
  if (status === 'idle') return null;

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-300 ${
        status === 'loading'
          ? 'bg-indigo-50/70 border-indigo-200/80 text-indigo-900'
          : status === 'success'
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
          : status === 'error'
          ? 'bg-rose-50/80 border-rose-200 text-rose-900'
          : 'bg-slate-50 border-slate-200 text-slate-700'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {status === 'loading' && (
            <div className="relative">
              <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
            </div>
          )}

          {status === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          )}

          {status === 'error' && (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          )}

          {status === 'empty' && (
            <Inbox className="w-5 h-5 text-slate-400 shrink-0" />
          )}

          <div>
            <p className="text-sm font-medium leading-snug">
              {status === 'loading' && loadingMessage}
              {status === 'success' && successMessage}
              {status === 'error' && errorMessage}
              {status === 'empty' && emptyMessage}
            </p>
            {status === 'loading' && (
              <p className="text-[11px] text-indigo-600/80 font-normal mt-0.5">
                Structured multi-criteria evaluation in progress
              </p>
            )}
          </div>
        </div>

        {status === 'error' && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        )}
      </div>
    </div>
  );
};
