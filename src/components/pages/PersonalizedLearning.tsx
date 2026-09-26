import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LearningItem, LearningResource, ResourcePlatform } from '../../types';
import { AIStateIndicator, AIStatus } from '../common/AIStateIndicator';
import {
  GraduationCap,
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Layers,
  AlertCircle,
  ExternalLink,
  Play,
  Code2,
  FileCode,
  Search,
  Check,
  Compass,
  TrendingUp,
  BookmarkCheck,
  Video,
  Terminal,
  FileText
} from 'lucide-react';

export const PersonalizedLearning: React.FC = () => {
  const {
    learningPlan,
    setLearningPlan,
    targetRole,
    userSkills,
    skillGaps,
    setCurrentPage,
    setSelectedSkillForProof,
    toggleResourceCompleted,
    searchAndAttachLiveResources,
    showNotification,
  } = useApp();

  const [aiStatus, setAiStatus] = useState<AIStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('ALL');

  const handleRegenerateCurriculum = async () => {
    setAiStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/generate-learning-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleTitle: targetRole?.roleTitle || 'Software Engineer',
          company: targetRole?.company || 'Sample Technologies',
          skillGaps,
          userSkills,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.items && data.items.length > 0) {
        setLearningPlan(data.items);
        setAiStatus('success');
        showNotification('Personalized curriculum updated with real external learning resources!');
      } else {
        setAiStatus('empty');
      }
    } catch (err: any) {
      console.error('Learning plan gen error:', err);
      setAiStatus('error');
      setErrorMessage(err.message || 'Failed to generate curriculum with Gemini. Please retry.');
    }
  };

  const handleProveSkillClick = (item: LearningItem) => {
    setSelectedSkillForProof({
      skillName: item.skill,
      topic: item.topic,
    });
    setCurrentPage('practice');
  };

  const getPlatformIcon = (platform: ResourcePlatform) => {
    switch (platform) {
      case 'YouTube':
        return <Play className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />;
      case 'LeetCode':
        return <Terminal className="w-3.5 h-3.5 text-amber-500" />;
      case 'Documentation':
        return <FileCode className="w-3.5 h-3.5 text-blue-600" />;
      case 'freeCodeCamp':
        return <Code2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'GeeksforGeeks':
        return <FileText className="w-3.5 h-3.5 text-emerald-700" />;
      case 'Interactive':
        return <Compass className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <ExternalLink className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getPlatformBadgeStyle = (platform: ResourcePlatform) => {
    switch (platform) {
      case 'YouTube':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'LeetCode':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Documentation':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'freeCodeCamp':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'GeeksforGeeks':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'Interactive':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header with Continuous Learning Loop Step Indicator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                What to Learn + Where to Learn
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Tailored for {targetRole?.roleTitle || 'Software Engineer'} at {targetRole?.company || 'Sample Technologies'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-indigo-600" />
              <span>Personalized Learning Engine & Real Resources</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
              Identifies your verified skill deficits and recommends <strong>real, reputable external learning materials</strong> from YouTube, LeetCode, official docs, and freeCodeCamp.
            </p>
          </div>

          <button
            onClick={handleRegenerateCurriculum}
            disabled={aiStatus === 'loading'}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 shrink-0 self-start sm:self-center"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>{aiStatus === 'loading' ? 'Generating with Gemini...' : 'Regenerate Adaptive Roadmap'}</span>
          </button>
        </div>

        {/* Product Loop Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Active Learning Flow
            </span>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-700">
              <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">1. Skill Gap</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">2. Target Topic</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold">3. Real Resources (YouTube/Docs)</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">4. Student Learns</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">5. Prove Skill</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">6. Reassess & Shrink Gap</span>
            </div>
          </div>
        </div>

        {/* Platform filter tabs */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium mr-1">Filter Resource Platform:</span>
          {['ALL', 'YouTube', 'LeetCode', 'Documentation', 'freeCodeCamp', 'GeeksforGeeks'].map((plat) => (
            <button
              key={plat}
              onClick={() => setSelectedPlatformFilter(plat)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                selectedPlatformFilter === plat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {/* AI State feedback */}
      <AIStateIndicator
        status={aiStatus}
        loadingMessage="Analyzing your demonstrated gaps, searching real resources with Gemini, and building custom modular curriculum..."
        successMessage="Personalized curriculum synthesized! Real external resources mapped to your skill deficits."
        errorMessage={errorMessage}
        onRetry={handleRegenerateCurriculum}
      />

      {/* Learning Items List */}
      <div className="space-y-5">
        {learningPlan.map((item, index) => {
          const isVerified = item.status === 'VERIFIED';
          const fullSkill = userSkills.find((s) => s.skillName.toLowerCase() === item.skill.toLowerCase());
          const resources = (item.learningResources || []).filter((r) => {
            if (selectedPlatformFilter === 'ALL') return true;
            return r.platform === selectedPlatformFilter;
          });
          const completedResourcesCount = (item.learningResources || []).filter((r) => r.isCompleted).length;

          return (
            <div
              key={item.id || index}
              className={`rounded-2xl border p-5 sm:p-6 transition-all bg-white shadow-sm hover:border-slate-300 ${
                isVerified ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'
              }`}
            >
              {/* Item Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                      {item.skill}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.priority === 'HIGH'
                          ? 'bg-rose-100 text-rose-800'
                          : item.priority === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {item.estimatedTime}
                    </span>
                    {isVerified && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified via Reassessment
                      </span>
                    )}
                    {item.status === 'COMPLETED' && !isVerified && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 flex items-center gap-1">
                        <BookmarkCheck className="w-3 h-3 text-blue-600" />
                        Ready to Prove
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {item.topic}
                  </h3>
                </div>

                {/* Prove This Skill CTA */}
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => handleProveSkillClick(item)}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                      isVerified
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                    <span>{isVerified ? 'Re-Prove This Skill' : 'Prove This Skill'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Rationale & Gap Context */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 mb-4">
                <span className="font-semibold text-slate-900">Personalized Deficit Rationale: </span>
                <span className="text-slate-600">{item.reason}</span>
                {fullSkill && (
                  <span className="ml-2 font-semibold text-indigo-700">
                    (Current: {fullSkill.demonstratedScore.toFixed(1)}/5, Required: {fullSkill.requiredLevel.toFixed(1)}/5, Gap: {(fullSkill.requiredLevel - fullSkill.demonstratedScore).toFixed(1)})
                  </span>
                )}
              </div>

              {/* Actionable Objectives */}
              {item.actionableObjectives && item.actionableObjectives.length > 0 && (
                <div className="mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Target Objectives
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.actionableObjectives.map((obj, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* REAL EXTERNAL LEARNING RESOURCES (WHERE TO LEARN) */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Where to Learn: Real External Resources & Tutorials</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Ranked by curriculum relevance. Direct links to actual YouTube videos, LeetCode challenges & official docs.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      {completedResourcesCount}/{item.learningResources?.length || 0} studied
                    </span>
                    <button
                      onClick={() => searchAndAttachLiveResources(item.id, item.skill, item.topic)}
                      disabled={item.isSearchingResources}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
                      title="Search web with Gemini to discover more real tutorials"
                    >
                      <Search className="w-3 h-3 text-indigo-600" />
                      <span>{item.isSearchingResources ? 'Searching...' : 'Search More Live'}</span>
                    </button>
                  </div>
                </div>

                {/* Resource Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {resources.map((res, rIdx) => (
                    <div
                      key={res.id || rIdx}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                        res.isCompleted
                          ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
                          : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        {/* Resource header: Platform + Type + Relevance badge */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getPlatformBadgeStyle(res.platform)}`}>
                              {getPlatformIcon(res.platform)}
                              <span>{res.platform}</span>
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase font-semibold">
                              {res.type}
                            </span>
                          </div>

                          {res.relevanceScore && (
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                              #{rIdx + 1} • {res.relevanceScore}% Match
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h5 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                          {res.title}
                        </h5>

                        {/* Creator & Duration */}
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                          {res.creator && (
                            <span className="font-medium text-slate-700">{res.creator}</span>
                          )}
                          {res.creator && res.durationOrReadTime && <span>•</span>}
                          {res.durationOrReadTime && (
                            <span className="flex items-center gap-1 text-slate-400">
                              <Clock className="w-3 h-3" />
                              {res.durationOrReadTime}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom action row: Link to resource + Mark studied */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          <span>Open Resource</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          type="button"
                          onClick={() => toggleResourceCompleted(item.id, res.id)}
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md transition-colors ${
                            res.isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>{res.isCompleted ? 'Studied' : 'Mark as Studied'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {resources.length === 0 && (
                  <p className="text-xs text-slate-400 italic py-2">
                    No resources matching platform filter "{selectedPlatformFilter}". Select "ALL" to view all resources.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
