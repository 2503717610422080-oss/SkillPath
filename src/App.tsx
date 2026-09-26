import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Dashboard } from './components/pages/Dashboard';
import { JobAnalyzer } from './components/pages/JobAnalyzer';
import { BaselineAssessment } from './components/pages/BaselineAssessment';
import { AssessmentResults } from './components/pages/AssessmentResults';
import { SkillGaps } from './components/pages/SkillGaps';
import { PersonalizedLearning } from './components/pages/PersonalizedLearning';
import { PracticeProve } from './components/pages/PracticeProve';
import { Projects } from './components/pages/Projects';
import { MockInterview } from './components/pages/MockInterview';
import { InterviewResults } from './components/pages/InterviewResults';
import { ResumeBuilder } from './components/pages/ResumeBuilder';
import { Onboarding } from './components/pages/Onboarding';
import { Login } from './components/pages/Login';
import {
  LayoutDashboard,
  FileSearch,
  FileCheck2,
  GitCompare,
  GraduationCap,
  Sparkles,
  Mic,
  FileText,
  Loader2
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentPage, setCurrentPage, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Loading SkillPath Evidence Profile...</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'login') {
    return <Login />;
  }

  const renderActiveView = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'job-analyzer':
        return <JobAnalyzer />;
      case 'baseline':
        return <BaselineAssessment />;
      case 'assessment-results':
        return <AssessmentResults />;
      case 'skill-gaps':
        return <SkillGaps />;
      case 'learning':
        return <PersonalizedLearning />;
      case 'practice':
        return <PracticeProve />;
      case 'projects':
        return <Projects />;
      case 'interview':
        return <MockInterview />;
      case 'interview-results':
        return <InterviewResults />;
      case 'resume':
        return <ResumeBuilder />;
      case 'onboarding':
        return <Onboarding />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Bottom Navigation for mobile screens */}
      <nav className="md:hidden sticky bottom-0 z-30 bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            currentPage === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentPage('job-analyzer')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            currentPage === 'job-analyzer' ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          <FileSearch className="w-4 h-4" />
          <span>Analyze</span>
        </button>

        <button
          onClick={() => setCurrentPage('baseline')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            currentPage === 'baseline' ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Test</span>
        </button>

        <button
          onClick={() => setCurrentPage('learning')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            currentPage === 'learning' ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Learn</span>
        </button>

        <button
          onClick={() => setCurrentPage('interview')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            currentPage === 'interview' ? 'text-indigo-600' : 'text-slate-400'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Interview</span>
        </button>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
