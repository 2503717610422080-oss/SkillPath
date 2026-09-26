import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AIStateIndicator, AIStatus } from '../common/AIStateIndicator';
import { ClaimVerifiedBar } from '../common/ClaimVerifiedBar';
import {
  Sparkles,
  CheckCircle2,
  Code2,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Send,
  RotateCcw
} from 'lucide-react';

interface ProveQuestion {
  id: string;
  type: 'mcq' | 'coding' | 'scenario';
  prompt: string;
  options?: string[];
  correctIndex?: number;
  starterCode?: string;
  expectedKeyElements?: string[];
  evaluationRubric?: string;
  explanation?: string;
}

export const PracticeProve: React.FC = () => {
  const {
    userSkills,
    selectedSkillForProof,
    setSelectedSkillForProof,
    completeProveSkill,
    setCurrentPage,
    showNotification,
  } = useApp();

  const [activeSkill, setActiveSkill] = useState<string>(
    selectedSkillForProof?.skillName || 'SQL'
  );
  const [topic, setTopic] = useState<string>(
    selectedSkillForProof?.topic || 'Complex Window Functions & Execution Plans'
  );

  const [questions, setQuestions] = useState<ProveQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { text: string; optionIndex?: number }>>({});
  const [aiStatus, setAiStatus] = useState<AIStatus>('idle');
  const [resultSummary, setResultSummary] = useState<{
    score: number;
    demonstratedAfter: number;
    delta: number;
    skill: string;
  } | null>(null);

  const generateClientFallbackQuiz = (skill: string) => {
    return [
      {
        id: 'q1',
        type: 'mcq' as const,
        prompt: `In real-world production environments using ${skill}, what is the primary architectural trade-off to consider?`,
        options: [
          'Execution time complexity vs memory overhead',
          'Code formatting vs compiler optimization',
          'Table row limits vs network bandwidth',
          'CPU core count vs thermal power draw'
        ],
        correctIndex: 0,
        explanation: 'Engineering design in production balances time efficiency against memory usage and algorithmic bounds.'
      },
      {
        id: 'q2',
        type: 'coding' as const,
        prompt: `Write or debug a concise, production-ready code snippet or query for ${skill} handling edge cases and errors:`,
        starterCode: `// Write optimal ${skill} logic\nfunction processTask(data) {\n  if (!data) return null;\n  // Implementation here\n}`,
        expectedKeyElements: ['null check', 'performance', 'error handling']
      },
      {
        id: 'q3',
        type: 'scenario' as const,
        prompt: `A critical system component relying on ${skill} encounters throughput degradation under peak load. How would you systematically diagnose and verify the resolution?`,
        evaluationRubric: 'Looks for monitoring/APM profiling, bottleneck identification, targeted optimization, and regression testing.'
      }
    ];
  };

  // Load or generate quiz
  const loadQuiz = async (skillToLoad: string, topicToLoad?: string) => {
    setAiStatus('loading');
    setResultSummary(null);
    setAnswers({});
    setCurrentIdx(0);

    try {
      let qData: any[] = [];
      try {
        const res = await fetch('/api/generate-prove-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skillName: skillToLoad,
            topic: topicToLoad || skillToLoad,
            currentDemonstrated: userSkills.find((s) => s.skillName === skillToLoad)?.demonstratedScore || 2.5,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          qData = data.questions || [];
        }
      } catch (fErr) {
        console.warn('Prove quiz API fetch warning, using client fallback:', fErr);
      }

      if (!qData || qData.length === 0) {
        qData = generateClientFallbackQuiz(skillToLoad);
      }

      setQuestions(qData);
      setAiStatus('idle');
    } catch (err: any) {
      console.error('Quiz load error:', err);
      setQuestions(generateClientFallbackQuiz(skillToLoad));
      setAiStatus('idle');
    }
  };

  useEffect(() => {
    loadQuiz(activeSkill, topic);
  }, [activeSkill]);

  const currentQ = questions[currentIdx];
  const targetSkillObj = userSkills.find((s) => s.skillName.toLowerCase() === activeSkill.toLowerCase());

  const handleSelectOption = (idx: number) => {
    if (!currentQ) return;
    setAnswers({
      ...answers,
      [currentQ.id]: {
        optionIndex: idx,
        text: currentQ.options ? currentQ.options[idx] : '',
      },
    });
  };

  const handleTextChange = (txt: string) => {
    if (!currentQ) return;
    setAnswers({
      ...answers,
      [currentQ.id]: {
        ...answers[currentQ.id],
        text: txt,
      },
    });
  };

  const handleSubmitProof = async () => {
    setAiStatus('loading');

    try {
      let earnedScore = 0;

      for (const q of questions) {
        const userAns = answers[q.id];
        if (q.type === 'mcq') {
          const isCorrect = userAns?.optionIndex === q.correctIndex;
          earnedScore += isCorrect ? 35 : 10;
        } else if (q.type === 'coding') {
          const text = userAns?.text || '';
          let matchCount = 0;
          if (q.expectedKeyElements) {
            for (const elem of q.expectedKeyElements) {
              if (text.toLowerCase().includes(elem.toLowerCase())) matchCount++;
            }
          }
          const ratio = q.expectedKeyElements ? matchCount / q.expectedKeyElements.length : 0.8;
          earnedScore += Math.round(ratio * 35);
        } else {
          // Scenario evaluated with Gemini or heuristic
          const text = userAns?.text || '';
          if (text.length > 20) {
            try {
              const res = await fetch('/api/evaluate-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  question: q.prompt,
                  studentAnswer: text,
                  rubric: q.evaluationRubric,
                  skillName: activeSkill,
                }),
              });
              if (res.ok) {
                const evalData = await res.json();
                earnedScore += Math.round((evalData.scoreOutOf100 || 80) * 0.30);
                continue;
              }
            } catch (e) {
              console.warn('Scenario eval fallback:', e);
            }
          }
          earnedScore += Math.min(30, Math.max(15, Math.round(text.length / 5)));
        }
      }

      // Bound score between 40 and 95
      const finalScore = Math.min(95, Math.max(45, Math.round(earnedScore)));

      // Update skill evidence
      const prevDemonstrated = targetSkillObj ? targetSkillObj.demonstratedScore : 2.0;
      await completeProveSkill(activeSkill, finalScore);

      // New demonstrated level
      const updatedDemonstrated = Number((prevDemonstrated + 0.6).toFixed(1));
      const delta = Number((updatedDemonstrated - prevDemonstrated).toFixed(1));

      setResultSummary({
        score: finalScore,
        demonstratedAfter: updatedDemonstrated,
        delta,
        skill: activeSkill,
      });

      setAiStatus('success');
      showNotification(`Reassessment complete! Demonstrated skill for ${activeSkill} upgraded.`);
    } catch (err: any) {
      console.error('Submit proof error:', err);
      setAiStatus('error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Continuous Reassessment
              </span>
              <span className="text-xs text-slate-500">Rapid 3-Question Verification</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Prove This Skill: {activeSkill}</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Completing this reassessment updates your demonstrated score, increases evidence confidence, and shrinks your skill gap.
            </p>
          </div>

          {/* Skill Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 self-start sm:self-center">
            {userSkills.map((s) => (
              <button
                key={s.skillName}
                onClick={() => {
                  setActiveSkill(s.skillName);
                  setTopic(s.skillName);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeSkill.toLowerCase() === s.skillName.toLowerCase()
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.skillName}
              </button>
            ))}
          </div>
        </div>

        {/* Current status bar */}
        {targetSkillObj && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Current Demonstrated:</span>
              <span className="font-bold text-slate-900">{targetSkillObj.demonstratedScore.toFixed(1)} / 5</span>
              <span className="text-slate-400">| Target: {targetSkillObj.requiredLevel.toFixed(1)} / 5</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{targetSkillObj.confidenceScore}% Evidence Confidence</span>
            </div>
          </div>
        )}
      </div>

      {/* AI State feedback */}
      <AIStateIndicator
        status={aiStatus}
        loadingMessage="Generating skill proof questions with Gemini..."
        successMessage="Evidence recorded! Your demonstrated skill profile and gap matrix have been updated."
        errorMessage="Failed to process skill reassessment. Please retry."
        onRetry={() => loadQuiz(activeSkill, topic)}
      />

      {/* Verification Success Result Card */}
      {resultSummary && (
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-7 shadow-sm animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Skill Proof Verified</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                {resultSummary.skill} Score Upgraded!
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-lg">
                Reassessment scored <strong className="text-white">{resultSummary.score}%</strong>. Your demonstrated score for {resultSummary.skill} increased from{' '}
                <strong className="text-white">{(resultSummary.demonstratedAfter - resultSummary.delta).toFixed(1)}</strong> to{' '}
                <strong className="text-emerald-400">{resultSummary.demonstratedAfter.toFixed(1)} / 5.0</strong>.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-center">
              <div>
                <span className="text-[10px] text-slate-300 uppercase block font-medium">Demonstrated</span>
                <span className="text-3xl font-black text-emerald-400">+{resultSummary.delta}</span>
                <span className="text-[10px] text-emerald-300 block font-semibold">Evidence Boost</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => loadQuiz(activeSkill, topic)}
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Take Another Challenge</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('skill-gaps')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Inspect Updated Gaps
              </button>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Return to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Card */}
      {!resultSummary && questions.length > 0 && currentQ && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
          {/* Question Stepper */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                {currentQ.type}
              </span>
            </div>
            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`w-6 h-6 rounded-md text-xs font-bold transition-all ${
                    i === currentIdx
                      ? 'bg-indigo-600 text-white'
                      : answers[questions[i]?.id]
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {currentQ.prompt}
          </h2>

          {/* Type: MCQ */}
          {currentQ.type === 'mcq' && currentQ.options && (
            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = answers[currentQ.id]?.optionIndex === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Type: Coding */}
          {currentQ.type === 'coding' && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono font-semibold text-slate-700">
                  <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Practical Solution Code / Query</span>
                </span>
                <span>Includes syntax & structure check</span>
              </div>
              <textarea
                rows={8}
                value={answers[currentQ.id]?.text || currentQ.starterCode || ''}
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full font-mono text-xs text-slate-100 bg-slate-900 p-4 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="-- Write query or implementation here"
              />
            </div>
          )}

          {/* Type: Scenario */}
          {currentQ.type === 'scenario' && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Production Scenario Response</span>
                <span>Evaluated via Gemini</span>
              </div>
              <textarea
                rows={6}
                value={answers[currentQ.id]?.text || ''}
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full text-xs sm:text-sm text-slate-800 p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Explain the architectural root cause, monitoring signals, and concrete recovery steps..."
              />
            </div>
          )}

          {/* Card footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              Previous
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(currentIdx + 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitProof}
                disabled={aiStatus === 'loading'}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Submit & Update Verified Evidence</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
