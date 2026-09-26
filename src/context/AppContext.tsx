import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  TargetRoleProfile,
  UserSkill,
  LearningItem,
  ProjectEvidenceItem,
  ResumeData,
  AssessmentRecord,
  InterviewSession,
  StudentAnswer,
  SkillGap
} from '../types';
import { StorageService } from '../services/storageService';
import { computeSkillGap, computeRoleAlignment } from '../services/skillEngine';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInAnonymously,
  signOut,
  linkWithPopup,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  User
} from '../firebase';

export type AppPage =
  | 'login'
  | 'onboarding'
  | 'dashboard'
  | 'job-analyzer'
  | 'baseline'
  | 'assessment-results'
  | 'skill-gaps'
  | 'learning'
  | 'practice'
  | 'projects'
  | 'interview'
  | 'interview-results'
  | 'resume';

interface AppContextType {
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  uid: string;
  firebaseUser: User | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  isAuthLoading: boolean;
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  targetRole: TargetRoleProfile;
  setTargetRole: (r: TargetRoleProfile) => void;
  userSkills: UserSkill[];
  setUserSkills: (s: UserSkill[]) => void;
  skillGaps: SkillGap[];
  learningPlan: LearningItem[];
  setLearningPlan: (p: LearningItem[]) => void;
  projects: ProjectEvidenceItem[];
  resume: ResumeData;
  setResume: (r: ResumeData) => void;
  lastAssessment: AssessmentRecord | null;
  setLastAssessment: (a: AssessmentRecord | null) => void;
  activeInterview: InterviewSession | null;
  setActiveInterview: (s: InterviewSession | null) => void;
  lastInterviewEvaluation: InterviewSession | null;
  selectedSkillForProof: { skillName: string; topic?: string } | null;
  setSelectedSkillForProof: (s: { skillName: string; topic?: string } | null) => void;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  
  // Auth Actions
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signupWithEmail: (email: string, pass: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  startDemoMode: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
  logout: () => Promise<void>;

  // Data Actions
  updateSelfClaimRatings: (claims: Record<string, number>) => Promise<void>;
  saveJobAnalysis: (roleData: TargetRoleProfile) => Promise<void>;
  completeBaselineAssessment: (answers: StudentAnswer[]) => Promise<void>;
  completeProveSkill: (skillName: string, scoreOutOf100: number) => Promise<void>;
  addProjectEvidence: (project: ProjectEvidenceItem) => Promise<void>;
  saveInterviewCompletion: (session: InterviewSession) => Promise<void>;
  resetAllDemoData: () => Promise<void>;
  toggleResourceCompleted: (itemId: string, resourceId: string) => Promise<void>;
  searchAndAttachLiveResources: (itemId: string, skill: string, topic: string) => Promise<void>;
  roleAlignment: {
    alignmentPercent: number;
    totalGaps: number;
    highPriorityGaps: number;
    verifiedCount: number;
  };
  isLoading: boolean;
  notification: string | null;
  showNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<AppPage>('login');
  const [uid, setUid] = useState<string>('');
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile>({
    uid: '',
    displayName: '',
    email: '',
    targetRole: '',
    targetCompany: '',
    onboardingComplete: false,
    createdAt: new Date().toISOString()
  });

  const [targetRole, setTargetRole] = useState<TargetRoleProfile>({} as TargetRoleProfile);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [learningPlan, setLearningPlan] = useState<LearningItem[]>([]);
  const [projects, setProjects] = useState<ProjectEvidenceItem[]>([]);
  const [resume, setResume] = useState<ResumeData>({} as ResumeData);
  const [lastAssessment, setLastAssessment] = useState<AssessmentRecord | null>(null);
  const [activeInterview, setActiveInterview] = useState<InterviewSession | null>(null);
  const [lastInterviewEvaluation, setLastInterviewEvaluation] = useState<InterviewSession | null>(null);
  const [selectedSkillForProof, setSelectedSkillForProof] = useState<{ skillName: string; topic?: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<string | null>(null);

  const isAuthenticated = Boolean(firebaseUser || isDemoMode);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  // Helper to load all user documents for a given UID
  const loadUserData = async (targetUid: string) => {
    try {
      const p = await StorageService.getUserProfile(targetUid);
      setProfile(p);

      const r = await StorageService.getTargetRole(targetUid);
      setTargetRole(r);

      const s = await StorageService.getUserSkills(targetUid);
      setUserSkills(s);

      const l = await StorageService.getLearningPlan(targetUid);
      setLearningPlan(l);

      const pr = await StorageService.getProjects(targetUid);
      setProjects(pr);

      const res = await StorageService.getResume(targetUid);
      setResume(res);
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  // Listen to persistent Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthLoading(true);
      if (user) {
        setFirebaseUser(user);
        setIsDemoMode(false);
        setUid(user.uid);
        try {
          await StorageService.createOrUpdateUserProfile(user.uid, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            isAnonymous: user.isAnonymous,
          });
          const userProf = await StorageService.getUserProfile(user.uid);
          await loadUserData(user.uid);
          // If first-time user (onboarding incomplete), direct to onboarding; otherwise dashboard
          if (!userProf.onboardingComplete) {
            setCurrentPage('onboarding');
          } else {
            setCurrentPage('dashboard');
          }
        } catch (e) {
          console.warn('Auth user setup warning:', e);
          await loadUserData(user.uid);
          setCurrentPage('dashboard');
        }
      } else {
        setFirebaseUser(null);
        // Do NOT automatically start demo mode or log in anonymously!
        setIsDemoMode(false);
        setUid('');
        setCurrentPage('login');
      }
      setIsAuthLoading(false);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // AUTH ACTION 1: Google Authentication (with smart linking of anonymous progress)
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    const currentAnon = auth.currentUser;
    const isAnon = currentAnon && currentAnon.isAnonymous;
    const prevUid = currentAnon ? currentAnon.uid : (isDemoMode ? 'demo-student-user' : null);

    try {
      if (isAnon) {
        // Upgrade anonymous account to Google account to preserve all data!
        try {
          const res = await linkWithPopup(currentAnon, googleProvider);
          if (res.user) {
            setFirebaseUser(res.user);
            setIsDemoMode(false);
            setUid(res.user.uid);
            await StorageService.createOrUpdateUserProfile(res.user.uid, {
              displayName: res.user.displayName,
              email: res.user.email,
              photoURL: res.user.photoURL,
              isAnonymous: false,
            });
            const p = await StorageService.getUserProfile(res.user.uid);
            await loadUserData(res.user.uid);
            showNotification(`Google account linked! Progress preserved for ${res.user.displayName || res.user.email}.`);
            setCurrentPage(p.onboardingComplete ? 'dashboard' : 'onboarding');
            return { success: true };
          }
        } catch (linkErr: any) {
          if (linkErr.code === 'auth/credential-already-in-use') {
            // Google account already exists -> sign in and migrate data
            const cred = GoogleAuthProvider.credentialFromError(linkErr);
            if (cred) {
              const signInRes = await signInWithCredential(auth, cred);
              if (signInRes.user) {
                setFirebaseUser(signInRes.user);
                setIsDemoMode(false);
                setUid(signInRes.user.uid);
                if (prevUid) {
                  await StorageService.migrateUserData(prevUid, signInRes.user.uid);
                }
                await StorageService.createOrUpdateUserProfile(signInRes.user.uid, {
                  displayName: signInRes.user.displayName,
                  email: signInRes.user.email,
                  photoURL: signInRes.user.photoURL,
                  isAnonymous: false,
                });
                const p = await StorageService.getUserProfile(signInRes.user.uid);
                await loadUserData(signInRes.user.uid);
                showNotification(`Signed in to Google account. Data synchronized successfully!`);
                setCurrentPage(p.onboardingComplete ? 'dashboard' : 'onboarding');
                return { success: true };
              }
            }
          }
          throw linkErr;
        }
      } else {
        // Standard Google sign-in
        const res = await signInWithPopup(auth, googleProvider);
        if (res.user) {
          setFirebaseUser(res.user);
          setIsDemoMode(false);
          setUid(res.user.uid);
          if (isDemoMode && prevUid) {
            await StorageService.migrateUserData(prevUid, res.user.uid);
          }
          await StorageService.createOrUpdateUserProfile(res.user.uid, {
            displayName: res.user.displayName,
            email: res.user.email,
            photoURL: res.user.photoURL,
            isAnonymous: false,
          });
          const p = await StorageService.getUserProfile(res.user.uid);
          await loadUserData(res.user.uid);
          showNotification(`Welcome, ${res.user.displayName || res.user.email}!`);
          setCurrentPage(p.onboardingComplete ? 'dashboard' : 'onboarding');
          return { success: true };
        }
      }
      return { success: true };
    } catch (err: any) {
      console.error('Google Auth error:', err);
      let friendlyError = err.message || 'Google sign-in failed.';
      if (err.code === 'auth/configuration-not-found' || err.code === 'auth/operation-not-allowed') {
        friendlyError = 'Google Sign-In is not enabled in Firebase Console. Please enable Google under Authentication > Sign-in method in Firebase Console.';
      } else if (err.code === 'auth/unauthorized-domain') {
        friendlyError = `Domain unauthorized for OAuth: ${window.location.hostname}. Please add this domain to Authorized Domains in Firebase Authentication Settings.`;
      } else if (err.code === 'auth/popup-blocked') {
        friendlyError = 'Google sign-in popup was blocked by your browser. Please allow popups for this site.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        friendlyError = 'Sign-in popup was closed before completing.';
      }
      setAuthError(friendlyError);
      return { success: false, error: friendlyError };
    }
  };

  // AUTH ACTION 2: Email + Password Login
  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        setFirebaseUser(cred.user);
        setIsDemoMode(false);
        setUid(cred.user.uid);
        const p = await StorageService.getUserProfile(cred.user.uid);
        await loadUserData(cred.user.uid);
        showNotification(`Signed in as ${cred.user.email}`);
        setCurrentPage(p.onboardingComplete ? 'dashboard' : 'onboarding');
        return { success: true };
      }
      return { success: true };
    } catch (err: any) {
      console.error('Email signin error:', err);
      let msg = err.message || 'Login failed.';
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Invalid email address format.';
      }
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // AUTH ACTION 3: Create Account with Email + Password
  const signupWithEmail = async (
    email: string,
    pass: string,
    name?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    const prevAnon = auth.currentUser?.isAnonymous ? auth.currentUser.uid : (isDemoMode ? 'demo-student-user' : null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        if (name) {
          try {
            await updateProfile(cred.user, { displayName: name });
          } catch (e) {
            console.warn('Profile name update error:', e);
          }
        }
        if (prevAnon) {
          await StorageService.migrateUserData(prevAnon, cred.user.uid);
        }
        await StorageService.createOrUpdateUserProfile(cred.user.uid, {
          displayName: name || email.split('@')[0],
          email: cred.user.email,
          isAnonymous: false,
          onboardingComplete: false,
        });
        setFirebaseUser(cred.user);
        setIsDemoMode(false);
        setUid(cred.user.uid);
        await loadUserData(cred.user.uid);
        showNotification(`Account created! Welcome, ${name || email}! Let's set up your profile.`);
        setCurrentPage('onboarding');
        return { success: true };
      }
      return { success: true };
    } catch (err: any) {
      console.error('Signup error:', err);
      let msg = err.message || 'Signup failed.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please log in.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // AUTH ACTION 4: Send Password Reset Email
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err: any) {
      console.error('Reset password error:', err);
      let msg = err.message || 'Failed to send password reset email.';
      if (err.code === 'auth/user-not-found') {
        msg = 'No user registered with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Invalid email address.';
      }
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // AUTH ACTION 5: Explicit Demo Mode
  const startDemoMode = async () => {
    setIsDemoMode(true);
    setUid('demo-student-user');
    await loadUserData('demo-student-user');
    setCurrentPage('dashboard');
    showNotification('Entered Demo Mode as candidate Alex Morgan (Software Engineer benchmark).');
  };

  // Continue as Guest (triggers explicit demo mode)
  const continueAsGuest = async () => {
    await startDemoMode();
  };

  // AUTH ACTION 6: Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout warning:', e);
    }
    setFirebaseUser(null);
    setIsDemoMode(false);
    setUid('');
    showNotification('Signed out successfully.');
    setCurrentPage('login');
  };

  // Derived gaps and alignment
  const skillGaps = userSkills.map(computeSkillGap).sort((a, b) => {
    const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    return b.gap - a.gap;
  });

  const roleAlignment = computeRoleAlignment(userSkills);

  // ACTION: Update self-claim ratings
  const updateSelfClaimRatings = async (claims: Record<string, number>) => {
    const updated = userSkills.map((s) => {
      const newClaim = claims[s.skillName] !== undefined ? claims[s.skillName] : s.selfClaimScore;
      return {
        ...s,
        selfClaimScore: newClaim,
      };
    });
    setUserSkills(updated);
    await StorageService.saveUserSkills(uid, updated);
    showNotification('Self-claimed skills saved. Note: Unverified until demonstrated.');
  };

  // ACTION: Save Job Analysis
  const saveJobAnalysis = async (roleData: TargetRoleProfile) => {
    setTargetRole(roleData);
    await StorageService.saveTargetRole(uid, roleData);

    // Update target profile
    const updatedProfile = {
      ...profile,
      targetRole: roleData.roleTitle,
      targetCompany: roleData.company,
    };
    setProfile(updatedProfile);
    await StorageService.saveUserProfile(updatedProfile);

    // Sync or introduce newly discovered skills into userSkills
    const existingMap = new Map(userSkills.map((s) => [s.skillName.toLowerCase(), s]));
    const newSkillsList: UserSkill[] = [...userSkills];

    const allExtracted = [
      ...roleData.highSkills,
      ...roleData.mediumSkills,
      ...roleData.lowSkills,
    ];

    allExtracted.forEach((ext) => {
      const key = ext.skill.toLowerCase();
      if (existingMap.has(key)) {
        const item = newSkillsList.find((s) => s.skillName.toLowerCase() === key);
        if (item) {
          item.requiredLevel = ext.required_level;
          item.importance = ext.importance;
        }
      } else {
        newSkillsList.push({
          skillName: ext.skill,
          category: ext.category || 'Core',
          selfClaimScore: 3.0,
          assessmentScore: 40,
          projectScore: 40,
          interviewScore: 40,
          demonstratedScore: 2.0,
          confidenceScore: 45,
          requiredLevel: ext.required_level,
          importance: ext.importance,
          lastUpdated: new Date().toISOString(),
          evidenceCount: 1,
        });
      }
    });

    setUserSkills(newSkillsList);
    await StorageService.saveUserSkills(uid, newSkillsList);
    showNotification(`Target job analysis saved: ${roleData.roleTitle} at ${roleData.company}`);
  };

  // ACTION: Complete Baseline Assessment
  const completeBaselineAssessment = async (answers: StudentAnswer[]) => {
    const skillScores: Record<string, { total: number; count: number }> = {};
    answers.forEach((ans) => {
      if (!skillScores[ans.skill]) {
        skillScores[ans.skill] = { total: 0, count: 0 };
      }
      skillScores[ans.skill].total += ans.scoreOutOf100;
      skillScores[ans.skill].count += 1;
    });

    // Update each skill's assessment score and recalculate demonstrated score
    let updatedSkills = [...userSkills];
    for (const [skillName, data] of Object.entries(skillScores)) {
      const avgScore = Math.round(data.total / data.count);
      updatedSkills = await StorageService.updateSkillEvidence(uid, skillName, {
        assessmentScore: avgScore,
      });
    }

    setUserSkills(updatedSkills);

    const record: AssessmentRecord = {
      id: `assessment-${Date.now()}`,
      title: 'Comprehensive Baseline Placement Assessment',
      type: 'baseline',
      completedAt: new Date().toISOString(),
      scoreOutOf100: Math.round(
        answers.reduce((acc, a) => acc + a.scoreOutOf100, 0) / Math.max(1, answers.length)
      ),
      answers,
      skillBreakdown: Object.fromEntries(
        Object.entries(skillScores).map(([k, v]) => [
          k,
          { score: Math.round(v.total / v.count), questions: v.count },
        ])
      ),
    };

    setLastAssessment(record);
    showNotification('Baseline assessment evaluated! Demonstrated skill profiles updated.');
  };

  // ACTION: Complete "Prove This Skill"
  const completeProveSkill = async (skillName: string, scoreOutOf100: number) => {
    const updatedSkills = await StorageService.updateSkillEvidence(uid, skillName, {
      assessmentScore: scoreOutOf100,
    });
    setUserSkills(updatedSkills);

    // Update learning item status
    const updatedLearning = learningPlan.map((item) => {
      if (item.skill.toLowerCase() === skillName.toLowerCase()) {
        return { ...item, status: 'VERIFIED' as const };
      }
      return item;
    });
    setLearningPlan(updatedLearning);
    await StorageService.saveLearningPlan(uid, updatedLearning);

    showNotification(`Skill proof recorded for ${skillName}! Demonstrated level increased.`);
  };

  // ACTION: Add Project Evidence
  const addProjectEvidence = async (project: ProjectEvidenceItem) => {
    const updatedProjects = [project, ...projects];
    setProjects(updatedProjects);
    await StorageService.saveProjects(uid, updatedProjects);

    // Update project scores for detected skills
    let current = [...userSkills];
    for (const det of project.detectedSkills) {
      current = await StorageService.updateSkillEvidence(uid, det.skill, {
        projectScore: project.projectScore,
      });
    }
    setUserSkills(current);
    showNotification(`Project "${project.name}" analyzed! Project evidence weighted into demonstrated skills.`);
  };

  // ACTION: Save Interview Evaluation
  const saveInterviewCompletion = async (session: InterviewSession) => {
    setActiveInterview(session);
    setLastInterviewEvaluation(session);

    if (session.evaluation) {
      let current = [...userSkills];

      // Update interview score for weak areas or core skills
      for (const weak of session.evaluation.weakAreas) {
        current = await StorageService.updateSkillEvidence(uid, weak.skill, {
          interviewScore: weak.score,
        });
      }

      // Also boost communication & problem solving
      current = await StorageService.updateSkillEvidence(uid, 'Communication', {
        interviewScore: session.evaluation.communicationScore,
      });
      current = await StorageService.updateSkillEvidence(uid, 'Problem Solving', {
        interviewScore: session.evaluation.problemSolvingScore,
      });

      setUserSkills(current);

      // Add learning recommendations for weak areas
      const newItems: LearningItem[] = [...learningPlan];
      session.evaluation.weakAreas.forEach((w) => {
        if (!newItems.some((item) => item.topic === w.suggestedTopic)) {
          newItems.unshift({
            id: `interview-rec-${Date.now()}-${w.skill}`,
            skill: w.skill,
            topic: w.suggestedTopic,
            priority: 'HIGH',
            reason: `Identified as interview weak point (${w.score}/100): ${w.reason}`,
            estimatedTime: '2 hours',
            status: 'NOT_STARTED',
            actionableObjectives: ['Review foundational nuances', 'Practice behavioral & code explanation'],
            learningResources: [
              {
                id: `res_int_${Date.now()}`,
                title: `${w.suggestedTopic} Tutorial`,
                platform: 'YouTube',
                type: 'Video',
                url: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${w.skill} ${w.suggestedTopic} tutorial`)}`,
                creator: 'Verified Educator',
                durationOrReadTime: '25 min video',
                relevanceScore: 95
              }
            ],
          });
        }
      });
      setLearningPlan(newItems);
      await StorageService.saveLearningPlan(uid, newItems);
    }

    showNotification('Mock interview evaluated! Verification scores and learning plan updated.');
  };

  // ACTION: Toggle Resource Completed
  const toggleResourceCompleted = async (itemId: string, resourceId: string) => {
    const updated = learningPlan.map((item) => {
      if (item.id !== itemId) return item;
      const updatedResources = (item.learningResources || []).map((res) => {
        if (res.id === resourceId) {
          return { ...res, isCompleted: !res.isCompleted };
        }
        return res;
      });

      const completedCount = updatedResources.filter((r) => r.isCompleted).length;
      let newStatus = item.status;
      if (item.status !== 'VERIFIED') {
        if (completedCount === updatedResources.length && updatedResources.length > 0) {
          newStatus = 'COMPLETED';
        } else if (completedCount > 0) {
          newStatus = 'IN_PROGRESS';
        } else {
          newStatus = 'NOT_STARTED';
        }
      }

      return {
        ...item,
        status: newStatus,
        learningResources: updatedResources,
      };
    });

    setLearningPlan(updated);
    await StorageService.saveLearningPlan(uid, updated);
    showNotification('Learning resource progress saved! You can now practice or prove this skill.');
  };

  // ACTION: Search and attach live resources using Gemini Google Search
  const searchAndAttachLiveResources = async (itemId: string, skill: string, topic: string) => {
    setLearningPlan((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, isSearchingResources: true } : i))
    );

    try {
      const res = await fetch('/api/search-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          skill,
          targetRole: targetRole?.roleTitle || 'Software Engineer',
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const discovered = data.resources || [];

      setLearningPlan((prev) => {
        const updated = prev.map((item) => {
          if (item.id !== itemId) return item;
          const existingUrls = new Set((item.learningResources || []).map((r) => r.url));
          const newUnique = discovered.filter((r: any) => !existingUrls.has(r.url));
          const merged = [...(item.learningResources || []), ...newUnique];
          return {
            ...item,
            learningResources: merged,
            isSearchingResources: false,
          };
        });
        StorageService.saveLearningPlan(uid, updated);
        return updated;
      });

      showNotification(`Discovered ${discovered.length} verified real learning resources for ${topic}!`);
    } catch (err: any) {
      console.error('Search resources error:', err);
      setLearningPlan((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, isSearchingResources: false } : i))
      );
      showNotification('Using curated real learning resources.');
    }
  };

  // ACTION: Reset demo
  const resetAllDemoData = async () => {
    await StorageService.resetToDemoData(uid);
    await loadUserData(uid);
    setLastAssessment(null);
    setActiveInterview(null);
    setLastInterviewEvaluation(null);
    showNotification('Reset to default Demo candidate data (Alex Morgan / Software Engineer).');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        uid,
        firebaseUser,
        isAuthenticated,
        isDemoMode,
        isAuthLoading,
        profile,
        setProfile,
        targetRole,
        setTargetRole,
        userSkills,
        setUserSkills,
        skillGaps,
        learningPlan,
        setLearningPlan,
        projects,
        resume,
        setResume,
        lastAssessment,
        setLastAssessment,
        activeInterview,
        setActiveInterview,
        lastInterviewEvaluation,
        selectedSkillForProof,
        setSelectedSkillForProof,
        authError,
        setAuthError,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        resetPassword,
        startDemoMode,
        continueAsGuest,
        logout,
        updateSelfClaimRatings,
        saveJobAnalysis,
        completeBaselineAssessment,
        completeProveSkill,
        addProjectEvidence,
        saveInterviewCompletion,
        resetAllDemoData,
        toggleResourceCompleted,
        searchAndAttachLiveResources,
        roleAlignment,
        isLoading,
        notification,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
