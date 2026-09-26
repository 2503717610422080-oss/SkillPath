import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ResumeData } from '../../types';
import { AIStateIndicator, AIStatus } from '../common/AIStateIndicator';
import {
  FileText,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Building2,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Award,
  Tag,
  ArrowRight
} from 'lucide-react';

export const ResumeBuilder: React.FC = () => {
  const { resume, setResume, targetRole, userSkills, showNotification } = useApp();

  const [aiStatus, setAiStatus] = useState<AIStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Verified skills vs Self-Claimed skills
  const verifiedSkills = userSkills.filter((s) => s.confidenceScore >= 70 && s.demonstratedScore >= 2.5);
  const selfClaimedSkills = userSkills.filter((s) => s.confidenceScore < 70 || s.demonstratedScore < 2.5);

  const handleTailorToRole = async () => {
    setAiStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume,
          targetRole: targetRole?.roleTitle || 'Software Engineer',
          targetCompany: targetRole?.company || 'Sample Technologies',
          jobDescription: targetRole?.jobDescription || '',
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const updatedResume: ResumeData = {
        ...resume,
        tailorAnalysis: {
          matchScore: data.matchScore || 78,
          disclaimer: data.disclaimer || 'SkillPath Resume Match Score (heuristic alignment, not employer ATS)',
          missingKeywords: data.missingKeywords || [],
          tailorSuggestions: data.tailorSuggestions || [],
          strengths: data.strengths || [],
          analyzedAt: new Date().toISOString(),
        },
      };

      setResume(updatedResume);
      setAiStatus('success');
      showNotification('Resume tailored against target role requirements!');
    } catch (err: any) {
      console.error('Tailor resume error:', err);
      setAiStatus('error');
      setErrorMessage(err.message || 'Failed to analyze resume match.');
    }
  };

  const tailor = resume.tailorAnalysis;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Placement Resume
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Verified Skill Portfolio
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Resume Builder & Role Tailor</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
              Distinguish between what you claim and what you have verified. Run Gemini analysis to compare keyword coverage against{' '}
              <strong className="text-slate-800">{targetRole?.roleTitle || 'Software Engineer'}</strong>.
            </p>
          </div>

          <button
            onClick={handleTailorToRole}
            disabled={aiStatus === 'loading'}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-center shrink-0"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>{aiStatus === 'loading' ? 'Analyzing with Gemini...' : 'Tailor to Target Role'}</span>
          </button>
        </div>
      </div>

      {/* AI State Feedback */}
      <AIStateIndicator
        status={aiStatus}
        loadingMessage="Cross-referencing resume against target job description and extracting missing keywords..."
        successMessage="Resume tailoring analysis complete! Review suggestions and missing keywords below."
        errorMessage={errorMessage}
        onRetry={handleTailorToRole}
      />

      {/* Tailor Analysis Feedback Card */}
      {tailor && (
        <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
                  Alignment Evaluation
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                SkillPath Resume Match Score
              </h2>
              <p className="text-[11px] text-slate-400 italic">
                {tailor.disclaimer}
              </p>
            </div>

            <div className="text-center bg-indigo-50 px-5 py-2.5 rounded-xl border border-indigo-100 shrink-0">
              <span className="text-3xl font-black text-indigo-600">{tailor.matchScore}%</span>
              <span className="text-[10px] text-indigo-800 font-bold block">Match Score</span>
            </div>
          </div>

          {/* Missing Keywords & Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                <Tag className="w-3.5 h-3.5" />
                <span>Relevant Missing Keywords</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tailor.missingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-2.5 py-1 bg-white border border-amber-300 text-amber-900 rounded-lg shadow-2xs"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                Actionable Tailoring Suggestions
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {tailor.tailorSuggestions.map((sug, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Resume Document Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Top Header */}
        <div className="border-b border-slate-200 pb-5">
          <h2 className="text-2xl font-black text-slate-900">{resume.fullName || 'Alex Morgan'}</h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
            <span>{resume.email}</span>
            <span>•</span>
            <span>{resume.phone}</span>
            <span>•</span>
            <span>San Francisco, CA</span>
          </div>
        </div>

        {/* Section: Summary */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
            Professional Summary
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            {resume.summary}
          </p>
        </div>

        {/* Section: Verified Skills vs Self-Claimed Skills */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
            Technical Competencies & Evidence Verification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Verified Skills */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Demonstrated & Verified Skills</span>
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                  Backed by tests & code
                </span>
              </div>
              <div className="space-y-2">
                {verifiedSkills.map((s) => (
                  <div key={s.skillName} className="flex justify-between items-center bg-white p-2 rounded-lg border border-emerald-100 text-xs">
                    <span className="font-semibold text-slate-900">{s.skillName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-700 font-bold">{s.demonstratedScore.toFixed(1)} / 5</span>
                      <span className="text-[10px] text-slate-400 font-medium">({s.confidenceScore}% conf)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Self-Claimed Skills */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Self-Reported (Unverified)</span>
                </span>
                <span className="text-[10px] text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full font-semibold">
                  Pending objective proof
                </span>
              </div>
              <div className="space-y-2">
                {selfClaimedSkills.map((s) => (
                  <div key={s.skillName} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-800">{s.skillName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-700 font-bold">{s.selfClaimScore.toFixed(1)} / 5</span>
                      <span className="text-[10px] text-slate-400">Claimed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Experience */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Professional Experience</span>
          </h3>
          <div className="space-y-3">
            {resume.experience?.map((exp, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{exp.title}</h4>
                    <span className="text-xs text-indigo-600 font-medium">{exp.company}</span>
                  </div>
                  <span className="text-xs text-slate-400">{exp.period}</span>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-slate-600">
                  {exp.highlights?.map((h, hIdx) => (
                    <li key={hIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Projects */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Verified Projects</span>
          </h3>
          <div className="space-y-3">
            {resume.projects?.map((proj, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-slate-900">{proj.name}</h4>
                  <span className="text-[11px] font-mono text-slate-500">{proj.techStack}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Education & Certifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Education</span>
            </h3>
            {resume.education?.map((edu, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="font-bold text-slate-900">{edu.degree}</div>
                <div className="text-slate-600">{edu.institution}</div>
                <div className="text-slate-400 mt-1">{edu.year} • GPA {edu.gpa}</div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Certifications</span>
            </h3>
            <div className="space-y-1.5">
              {resume.certifications?.map((c, i) => (
                <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-800">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
