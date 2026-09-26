import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TargetRoleProfile, ExtractedRoleSkill, PriorityLevel } from '../../types';
import { AIStateIndicator, AIStatus } from '../common/AIStateIndicator';
import {
  FileSearch,
  Building2,
  Briefcase,
  Sparkles,
  Layers,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export const JobAnalyzer: React.FC = () => {
  const { targetRole, saveJobAnalysis, setCurrentPage } = useApp();

  const [roleTitle, setRoleTitle] = useState(targetRole?.roleTitle || 'Software Engineer');
  const [company, setCompany] = useState(targetRole?.company || 'Sample Technologies');
  const [jobDescription, setJobDescription] = useState(
    targetRole?.jobDescription ||
`Sample Technologies is looking for a Software Engineer to join our Core Backend Platform team.
You will build high-throughput microservices, design relational schemas, write high-performance queries, and participate in code reviews.

Key Requirements:
- Deep proficiency in Java and modern frameworks (Spring Boot)
- Strong foundation in Data Structures and Algorithms (DSA)
- Relational database modeling and SQL query tuning (PostgreSQL or MySQL)
- Solid understanding of Object-Oriented Programming (OOP) and Clean Code
- Experience with Git branching, pull requests, and CI/CD
- Strong problem-solving mindset and cross-functional communication`
  );

  const [aiStatus, setAiStatus] = useState<AIStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [extractedData, setExtractedData] = useState<TargetRoleProfile | null>(targetRole || null);

  const handleAnalyze = async () => {
    if (!roleTitle.trim() || !jobDescription.trim()) {
      alert('Please provide both a Role Title and Job Description.');
      return;
    }

    setAiStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleTitle, company, jobDescription }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const profileData: TargetRoleProfile = {
        id: `role-${Date.now()}`,
        roleTitle,
        company: company || 'Target Company',
        jobDescription,
        highSkills: data.highSkills || [],
        mediumSkills: data.mediumSkills || [],
        lowSkills: data.lowSkills || [],
        behavioralSkills: data.behavioralSkills || [],
        summary: data.summary || `Extracted requirements for ${roleTitle}`,
        analyzedAt: new Date().toISOString(),
      };

      setExtractedData(profileData);
      await saveJobAnalysis(profileData);
      setAiStatus('success');
    } catch (err: any) {
      console.error('Job analysis error:', err);
      setAiStatus('error');
      setErrorMessage(err.message || 'Failed to extract job skills with Gemini. Please retry.');
    }
  };

  const renderSkillBadgeGroup = (
    skills: ExtractedRoleSkill[],
    title: string,
    priority: PriorityLevel,
    badgeBg: string,
    badgeText: string,
    borderColor: string
  ) => {
    return (
      <div className={`p-4 rounded-xl border ${borderColor} bg-white shadow-sm`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeBg} ${badgeText}`}>
              {priority} Importance
            </span>
            <span className="text-xs text-slate-500 font-medium">({skills.length} skills)</span>
          </div>
        </div>

        {skills.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No skills in this category</p>
        ) : (
          <div className="space-y-2.5">
            {skills.map((s, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{s.skill}</span>
                    <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.5 bg-slate-200/70 rounded">
                      {s.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{s.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">Required</span>
                  <span className="text-xs font-bold text-slate-800">{s.required_level.toFixed(1)} / 5</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <FileSearch className="w-6 h-6 text-indigo-600" />
            <span>Job Requirement Analyzer</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Extract verified skill expectations from raw job postings using Gemini structured extraction.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Role</span>
            </label>
            <input
              type="text"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Software Engineer, Backend Developer"
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Company</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Sample Technologies, Google, Amazon"
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Job Description / Requirements</span>
          </label>
          <textarea
            rows={7}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste entire job description text here..."
            className="w-full font-mono text-xs text-slate-800 p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>AI extracts strict requirements without hallucinating extra tools.</span>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={aiStatus === 'loading'}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>{aiStatus === 'loading' ? 'Analyzing with Gemini...' : 'Analyze Job Requirements'}</span>
          </button>
        </div>
      </div>

      {/* AI State Feedback */}
      <AIStateIndicator
        status={aiStatus}
        loadingMessage="Analyzing job description and extracting categorized skill requirements..."
        successMessage="Job requirements successfully parsed and synced with your candidate target profile!"
        errorMessage={errorMessage}
        onRetry={handleAnalyze}
      />

      {/* Structured Extraction Results */}
      {extractedData && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/70 border border-indigo-100 rounded-xl p-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Target Role Profile</span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                {extractedData.roleTitle} @ {extractedData.company}
              </h2>
              {extractedData.summary && (
                <p className="text-xs text-slate-600 mt-1 max-w-2xl">{extractedData.summary}</p>
              )}
            </div>
            <button
              onClick={() => setCurrentPage('baseline')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <span>Proceed to Baseline Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* HIGH, MEDIUM, LOW groups */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {renderSkillBadgeGroup(
              extractedData.highSkills || [],
              'High Priority Core Skills',
              'HIGH',
              'bg-rose-100',
              'text-rose-800',
              'border-rose-200'
            )}

            {renderSkillBadgeGroup(
              extractedData.mediumSkills || [],
              'Medium Priority Skills',
              'MEDIUM',
              'bg-amber-100',
              'text-amber-800',
              'border-amber-200'
            )}

            {renderSkillBadgeGroup(
              extractedData.lowSkills || [],
              'Low / Nice-to-Have Skills',
              'LOW',
              'bg-slate-100',
              'text-slate-700',
              'border-slate-200'
            )}
          </div>

          {/* Behavioral skills */}
          {extractedData.behavioralSkills && extractedData.behavioralSkills.length > 0 && (
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Behavioral & Collaboration Competencies
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {extractedData.behavioralSkills.map((b, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-900">{b.skill}</span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        Level {b.required_level}/5
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{b.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
