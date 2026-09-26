import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  Briefcase,
  Building2,
  Sliders,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const Onboarding: React.FC = () => {
  const {
    profile,
    setProfile,
    targetRole,
    setTargetRole,
    userSkills,
    updateSelfClaimRatings,
    setCurrentPage,
    showNotification,
  } = useApp();

  const [roleTitle, setRoleTitle] = useState(profile.targetRole || 'Software Engineer');
  const [company, setCompany] = useState(profile.targetCompany || 'Sample Technologies');
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    userSkills.forEach((s) => {
      initial[s.skillName] = s.selfClaimScore;
    });
    return initial;
  });

  const handleRatingChange = (skillName: string, val: number) => {
    setRatings((prev) => ({
      ...prev,
      [skillName]: val,
    }));
  };

  const handleSaveAndContinue = async () => {
    const updatedProfile = {
      ...profile,
      targetRole: roleTitle,
      targetCompany: company,
      onboardingComplete: true,
    };
    setProfile(updatedProfile);

    setTargetRole({
      ...targetRole,
      roleTitle,
      company,
    });

    await updateSelfClaimRatings(ratings);
    showNotification('Self-assessment saved! Proceed to Baseline Assessment to verify.');
    setCurrentPage('dashboard');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Step 1 • Initial Self-Report
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-600" />
          <span>Candidate Onboarding & Self-Assessment</span>
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
          Set your target job parameters and rate your self-claimed skill levels.
          SkillPath will benchmark these claims against objective assessments and code evidence.
        </p>
      </div>

      {/* Target Role & Company */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Target Placement Goals
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
              <span>Target Role</span>
            </label>
            <input
              type="text"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Software Engineer"
              className="w-full text-xs sm:text-sm font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Target Company</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Sample Technologies"
              className="w-full text-xs sm:text-sm font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Skills Self-Assessment Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>Student Self-Assessment (1 – 5 Scale)</span>
            </h2>
            <p className="text-xs text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Self-reported — not verified</span>
            </p>
          </div>
          <span className="text-xs text-slate-400">Rate honestly: benchmark test will follow</span>
        </div>

        <div className="space-y-4 pt-1">
          {userSkills.map((skill) => {
            const currentRating = ratings[skill.skillName] !== undefined ? ratings[skill.skillName] : skill.selfClaimScore;
            return (
              <div key={skill.skillName} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{skill.skillName}</span>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 px-1.5 py-0.5 bg-slate-200 rounded">
                      {skill.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Claimed:</span>
                    <span className="text-sm font-black text-indigo-700">{currentRating.toFixed(1)} / 5.0</span>
                    <span className="text-[10px] text-amber-600 font-medium">(Unverified)</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.5"
                    value={currentRating}
                    onChange={(e) => handleRatingChange(skill.skillName, parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleRatingChange(skill.skillName, num)}
                        className={`w-6 h-6 rounded-md text-xs font-bold transition-all ${
                          Math.round(currentRating) === num
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs text-slate-400">Evidence weighting will apply during objective assessment.</span>
          <button
            onClick={handleSaveAndContinue}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>Save Claims & Enter Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
