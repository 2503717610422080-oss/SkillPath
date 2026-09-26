import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { InterviewTurn, InterviewSession } from '../../types';
import { AIStateIndicator, AIStatus } from '../common/AIStateIndicator';
import {
  Mic,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  StopCircle,
  PlayCircle,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const MockInterview: React.FC = () => {
  const {
    targetRole,
    userSkills,
    projects,
    saveInterviewCompletion,
    setCurrentPage,
  } = useApp();

  const [sessionTurns, setSessionTurns] = useState<InterviewTurn[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [targetedSkill, setTargetedSkill] = useState<string>('Java');
  const [candidateAnswer, setCandidateAnswer] = useState<string>('');
  const [turnIndex, setTurnIndex] = useState<number>(0);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [aiStatus, setAiStatus] = useState<AIStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const weakSkills = userSkills
    .filter((s) => s.requiredLevel - s.demonstratedScore > 0.5)
    .map((s) => s.skillName);

  // Start interview session
  const handleStartSession = async () => {
    setIsSessionActive(true);
    setSessionTurns([]);
    setTurnIndex(0);
    setAiStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleTitle: targetRole?.roleTitle || 'Software Engineer',
          company: targetRole?.company || 'Sample Technologies',
          weakSkills,
          projects: projects.map((p) => ({ name: p.name, tech: p.technologies })),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setCurrentQuestion(data.question || 'Welcome! Could you explain how you design thread-safe Java systems?');
      setTargetedSkill(data.targetedSkill || 'Java');
      setAiStatus('idle');
    } catch (err: any) {
      console.error('Interview start error:', err);
      setAiStatus('error');
      setErrorMessage(err.message || 'Failed to initialize AI interviewer.');
    }
  };

  // Submit candidate answer turn
  const handleSubmitAnswer = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!candidateAnswer.trim() || aiStatus === 'loading') return;

    const answerText = candidateAnswer;
    setCandidateAnswer('');
    setAiStatus('loading');

    const newTurn: InterviewTurn = {
      id: `turn-${turnIndex + 1}`,
      turnNumber: turnIndex + 1,
      interviewerQuestion: currentQuestion,
      candidateAnswer: answerText,
      targetedSkill,
    };

    const updatedTurns = [...sessionTurns, newTurn];
    setSessionTurns(updatedTurns);

    if (turnIndex >= 4) {
      // Final turn reached -> trigger evaluation!
      await handleCompleteEvaluation(updatedTurns);
      return;
    }

    try {
      const res = await fetch('/api/interview/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleTitle: targetRole?.roleTitle || 'Software Engineer',
          company: targetRole?.company || 'Sample Technologies',
          transcript: updatedTurns,
          lastQuestion: currentQuestion,
          lastAnswer: answerText,
          turnIndex: turnIndex + 1,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      newTurn.feedback = data.feedback;
      setSessionTurns([...sessionTurns, newTurn]);

      setCurrentQuestion(data.nextQuestion || 'How do you handle transactional isolation in SQL?');
      setTargetedSkill(data.targetedSkill || 'SQL');
      setTurnIndex(turnIndex + 1);
      setAiStatus('idle');
    } catch (err: any) {
      console.error('Interview turn error:', err);
      setAiStatus('error');
    }
  };

  const handleCompleteEvaluation = async (finalTurns: InterviewTurn[]) => {
    setAiStatus('loading');
    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleTitle: targetRole?.roleTitle || 'Software Engineer',
          company: targetRole?.company || 'Sample Technologies',
          transcript: finalTurns,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const evalData = await res.json();

      const session: InterviewSession = {
        id: `session-${Date.now()}`,
        roleTitle: targetRole?.roleTitle || 'Software Engineer',
        company: targetRole?.company || 'Sample Technologies',
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        status: 'COMPLETED',
        turns: finalTurns,
        evaluation: evalData,
      };

      await saveInterviewCompletion(session);
      setAiStatus('success');
      setTimeout(() => {
        setCurrentPage('interview-results');
      }, 1000);
    } catch (err: any) {
      console.error('Interview eval error:', err);
      setAiStatus('error');
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessionTurns, currentQuestion, aiStatus]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Live AI Assessment
              </span>
              <span className="text-xs text-slate-500 font-medium">
                20% Evidence Weighting
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Mic className="w-5 h-5 text-indigo-600" />
              <span>Adaptive Mock Technical Interview</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Interviewer adapts follow-ups based on the depth of your answers. Targets weak areas ({weakSkills.join(', ')}).
            </p>
          </div>

          {!isSessionActive ? (
            <button
              onClick={handleStartSession}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-center"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Start 5-Turn Interview</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Turn {turnIndex + 1} / 5</span>
              <button
                onClick={() => handleCompleteEvaluation(sessionTurns)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Finish Early</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interviewer Persona Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Principal Technical Interviewer</h3>
            <p className="text-xs text-slate-300">
              {targetRole?.company || 'Sample Technologies'} • {targetRole?.roleTitle || 'Backend Platform'}
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block text-xs text-slate-300">
          <span className="text-emerald-400 font-bold block">Evaluating</span>
          <span>Technical Depth, Problem Solving, Communication</span>
        </div>
      </div>

      {/* Main Conversation Stream */}
      {isSessionActive && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm min-h-[420px] flex flex-col justify-between space-y-4">
          <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
            {/* Prior turns */}
            {sessionTurns.map((turn, idx) => (
              <div key={turn.id || idx} className="space-y-3">
                {/* Interviewer Question */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 max-w-2xl text-xs sm:text-sm text-slate-800">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                        Interviewer Question ({turn.targetedSkill})
                      </span>
                    </div>
                    <p className="leading-relaxed">{turn.interviewerQuestion}</p>
                  </div>
                </div>

                {/* Candidate Answer */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-indigo-600 text-white rounded-2xl p-4 max-w-2xl text-xs sm:text-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200 block mb-1">
                      Candidate Response
                    </span>
                    <p className="leading-relaxed whitespace-pre-wrap">{turn.candidateAnswer}</p>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                </div>

                {/* Optional immediate turn feedback */}
                {turn.feedback && (
                  <div className="ml-10 text-[11px] text-slate-500 italic bg-amber-50/60 border border-amber-100 p-2 rounded-lg max-w-xl">
                    Interviewer reaction: {turn.feedback}
                  </div>
                )}
              </div>
            ))}

            {/* Current Active Question */}
            {currentQuestion && (
              <div className="flex items-start gap-3 animate-in fade-in duration-300">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 max-w-2xl text-xs sm:text-sm text-slate-900 font-medium">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                      Active Question • Turn {turnIndex + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{targetedSkill}</span>
                  </div>
                  <p className="leading-relaxed font-semibold">{currentQuestion}</p>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* AI State feedback */}
          <AIStateIndicator
            status={aiStatus}
            loadingMessage="Interviewer is analyzing your response and formulating the adaptive next question..."
            successMessage="Interview evaluation complete! Redirecting to committee score report..."
            errorMessage={errorMessage}
            onRetry={() => handleSubmitAnswer()}
          />

          {/* Response Form */}
          <form onSubmit={handleSubmitAnswer} className="pt-3 border-t border-slate-100 flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                rows={3}
                disabled={aiStatus === 'loading'}
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
                placeholder="Type your structured technical response (address trade-offs, architecture, and edge cases)..."
                className="w-full text-xs sm:text-sm text-slate-800 p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              />
            </div>

            <button
              type="submit"
              disabled={!candidateAnswer.trim() || aiStatus === 'loading'}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <span>{turnIndex >= 4 ? 'Submit Final Turn' : 'Send Answer'}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
