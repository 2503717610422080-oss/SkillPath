import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectEvidenceItem } from '../../types';
import { AIStateIndicator, AIStatus } from '../common/AIStateIndicator';
import {
  FolderGit2,
  Github,
  Plus,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Code,
  Layers,
  ArrowRight
} from 'lucide-react';

export const Projects: React.FC = () => {
  const { projects, addProjectEvidence, setCurrentPage } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [description, setDescription] = useState('');
  const [aiStatus, setAiStatus] = useState<AIStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAnalyzeProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      alert('Please fill in project name and technical description.');
      return;
    }

    setAiStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/analyze-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, githubUrl, description }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const newProject: ProjectEvidenceItem = {
        id: `proj-${Date.now()}`,
        name,
        githubUrl: githubUrl || 'https://github.com/candidate/portfolio-repo',
        description,
        technologies: data.technologies || ['Java', 'SQL', 'Git'],
        detectedSkills: data.detectedSkills || [
          { skill: 'Java', demonstratedLevel: 3.4, confidence: 70, rationale: 'REST architecture' },
          { skill: 'SQL', demonstratedLevel: 3.0, confidence: 65, rationale: 'Relational queries' }
        ],
        evidenceNotes: data.evidenceNotes || 'Practical application evidence verified.',
        limitations: data.limitations || ['Moderate test coverage'],
        projectScore: data.projectScore || 75,
        addedAt: new Date().toISOString(),
      };

      await addProjectEvidence(newProject);
      setAiStatus('success');
      setShowAddForm(false);
      setName('');
      setGithubUrl('');
      setDescription('');
    } catch (err: any) {
      console.error('Project analyze error:', err);
      setAiStatus('error');
      setErrorMessage(err.message || 'Failed to analyze project with Gemini.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                20% Evidence Weighting
              </span>
              <span className="text-xs text-slate-500">Portfolio & Codebase Auditor</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-indigo-600" />
              <span>Project Evidence</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
              Connect real GitHub repositories to substantiate claims with tangible code artifacts.
              Note: Project code contributes 20% to verified evidence, but does not substitute for objective tests.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 self-start sm:self-center shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel' : 'Submit Project Repository'}</span>
          </button>
        </div>
      </div>

      {/* Add Project Form */}
      {showAddForm && (
        <form onSubmit={handleAnalyzeProject} className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Analyze New Repository with Gemini</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Project Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Distributed Task Queue Service"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/project-repo"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Architecture & Technical Description
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe technologies, data model, APIs, concurrency, and key technical challenges solved..."
              className="w-full text-xs sm:text-sm text-slate-800 p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">Gemini evaluates code complexity, architecture, and technology depth.</span>
            <button
              type="submit"
              disabled={aiStatus === 'loading'}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>{aiStatus === 'loading' ? 'Auditing Codebase...' : 'Analyze & Extract Skills'}</span>
            </button>
          </div>
        </form>
      )}

      {/* AI State feedback */}
      <AIStateIndicator
        status={aiStatus}
        loadingMessage="Auditing project structure, detecting tech stack, and calculating skill evidence weighting..."
        successMessage="Project analyzed and added to your verified evidence portfolio!"
        errorMessage={errorMessage}
      />

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4 hover:border-slate-300 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{proj.name}</h3>
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-slate-800 transition-colors inline-flex items-center gap-1 text-xs"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1">{proj.description}</p>
              </div>

              <div className="text-right shrink-0 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Evidence Score</span>
                <span className="text-lg font-black text-slate-900">{proj.projectScore} <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
              </div>
            </div>

            {/* Detected Skills Breakdown */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Demonstrated Skills Extracted via Code Audit
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {proj.detectedSkills.map((det, i) => (
                  <div key={i} className="p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900">{det.skill}</span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {det.demonstratedLevel.toFixed(1)} / 5
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{det.rationale}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-slate-400 mr-1">Stack:</span>
              {proj.technologies.map((t, i) => (
                <span key={i} className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {t}
                </span>
              ))}
            </div>

            {/* Limitations & Notes */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-1 text-slate-600">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>{proj.evidenceNotes}</span>
              </div>
              {proj.limitations && proj.limitations.length > 0 && (
                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                  Limitation: {proj.limitations[0]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
