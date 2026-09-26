import { db, doc, setDoc, getDoc, collection, getDocs } from '../firebase';
import { UserSkill, TargetRoleProfile, LearningItem, InterviewSession, ProjectEvidenceItem, ResumeData, UserProfile } from '../types';
import { calculateDemonstratedScore, calculateConfidenceScore } from './skillEngine';
import { INITIAL_DEMO_SKILLS, DEMO_TARGET_ROLE, INITIAL_LEARNING_ITEMS, INITIAL_PROJECTS, INITIAL_RESUME } from './defaultData';

const LOCAL_STORAGE_KEY_PREFIX = 'skillpath_app_';

function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage set failed:', e);
  }
}

export class StorageService {
  // 1. User Profile
  static async getUserProfile(uid: string): Promise<UserProfile> {
    const isDemo = uid === 'demo-student-user';
    const defaultProfile: UserProfile = {
      uid,
      displayName: isDemo ? 'Alex Morgan' : 'Candidate',
      email: isDemo ? 'alex.morgan@sampletech.edu' : '',
      targetRole: isDemo ? 'Software Engineer' : '',
      targetCompany: isDemo ? 'Sample Technologies' : '',
      onboardingComplete: isDemo,
      createdAt: new Date().toISOString()
    };

    try {
      const snap = await getDoc(doc(db, 'profiles', uid));
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setLocal(`profile_${uid}`, data);
        return data;
      }
    } catch (e) {
      console.warn('Firestore read profile error, using cached:', e);
    }
    return getLocal(`profile_${uid}`, defaultProfile);
  }

  static async saveUserProfile(profile: UserProfile): Promise<void> {
    setLocal(`profile_${profile.uid}`, profile);
    try {
      await setDoc(doc(db, 'profiles', profile.uid), profile, { merge: true });
    } catch (e) {
      console.warn('Firestore write profile error:', e);
    }
  }

  // 2. Target Role
  static async getTargetRole(uid: string): Promise<TargetRoleProfile> {
    try {
      const snap = await getDoc(doc(db, 'targetRoles', uid));
      if (snap.exists()) {
        const data = snap.data() as TargetRoleProfile;
        setLocal(`targetRole_${uid}`, data);
        return data;
      }
    } catch (e) {
      console.warn('Firestore read targetRole error, using cached:', e);
    }
    return getLocal(`targetRole_${uid}`, DEMO_TARGET_ROLE);
  }

  static async saveTargetRole(uid: string, role: TargetRoleProfile): Promise<void> {
    setLocal(`targetRole_${uid}`, role);
    try {
      await setDoc(doc(db, 'targetRoles', uid), role);
    } catch (e) {
      console.warn('Firestore write targetRole error:', e);
    }
  }

  // 3. User Skills
  static async getUserSkills(uid: string): Promise<UserSkill[]> {
    try {
      const snap = await getDoc(doc(db, 'userSkills', uid));
      if (snap.exists() && snap.data()?.skills) {
        const data = snap.data().skills as UserSkill[];
        setLocal(`skills_${uid}`, data);
        return data;
      }
    } catch (e) {
      console.warn('Firestore read userSkills error, using cached:', e);
    }
    return getLocal(`skills_${uid}`, INITIAL_DEMO_SKILLS);
  }

  static async saveUserSkills(uid: string, skills: UserSkill[]): Promise<void> {
    setLocal(`skills_${uid}`, skills);
    try {
      await setDoc(doc(db, 'userSkills', uid), { skills, updatedAt: new Date().toISOString() });
    } catch (e) {
      console.warn('Firestore write userSkills error:', e);
    }
  }

  // Update a single skill or recalculate evidence
  static async updateSkillEvidence(
    uid: string,
    skillName: string,
    updates: {
      selfClaim?: number;
      assessmentScore?: number;
      projectScore?: number;
      interviewScore?: number;
    }
  ): Promise<UserSkill[]> {
    const currentSkills = await this.getUserSkills(uid);
    const updatedSkills = currentSkills.map(s => {
      if (s.skillName.toLowerCase() !== skillName.toLowerCase()) {
        return s;
      }

      const selfClaim = updates.selfClaim !== undefined ? updates.selfClaim : s.selfClaimScore;
      const assessment = updates.assessmentScore !== undefined ? updates.assessmentScore : s.assessmentScore;
      const project = updates.projectScore !== undefined ? updates.projectScore : s.projectScore;
      const interview = updates.interviewScore !== undefined ? updates.interviewScore : s.interviewScore;

      const { score5 } = calculateDemonstratedScore(selfClaim, assessment, project, interview);
      const confidence = calculateConfidenceScore({
        hasSelfClaim: selfClaim > 0,
        hasAssessment: assessment > 0,
        hasProject: project > 0,
        hasInterview: interview > 0,
        reassessmentCount: (s.evidenceCount || 1) + 1
      });

      return {
        ...s,
        selfClaimScore: selfClaim,
        assessmentScore: assessment,
        projectScore: project,
        interviewScore: interview,
        demonstratedScore: score5,
        confidenceScore: confidence,
        evidenceCount: (s.evidenceCount || 1) + 1,
        lastUpdated: new Date().toISOString()
      };
    });

    await this.saveUserSkills(uid, updatedSkills);
    return updatedSkills;
  }

  // 4. Learning Plan
  static async getLearningPlan(uid: string): Promise<LearningItem[]> {
    try {
      const snap = await getDoc(doc(db, 'learningPlans', uid));
      if (snap.exists() && snap.data()?.items) {
        const data = snap.data().items as LearningItem[];
        setLocal(`learningPlan_${uid}`, data);
        return data;
      }
    } catch (e) {
      console.warn('Firestore read learningPlan error, using cached:', e);
    }
    return getLocal(`learningPlan_${uid}`, INITIAL_LEARNING_ITEMS);
  }

  static async saveLearningPlan(uid: string, items: LearningItem[]): Promise<void> {
    setLocal(`learningPlan_${uid}`, items);
    try {
      await setDoc(doc(db, 'learningPlans', uid), { items, updatedAt: new Date().toISOString() });
    } catch (e) {
      console.warn('Firestore write learningPlan error:', e);
    }
  }

  // 5. Projects
  static async getProjects(uid: string): Promise<ProjectEvidenceItem[]> {
    try {
      const snap = await getDoc(doc(db, 'projects', uid));
      if (snap.exists() && snap.data()?.projects) {
        const data = snap.data().projects as ProjectEvidenceItem[];
        setLocal(`projects_${uid}`, data);
        return data;
      }
    } catch (e) {
      console.warn('Firestore read projects error, using cached:', e);
    }
    return getLocal(`projects_${uid}`, INITIAL_PROJECTS);
  }

  static async saveProjects(uid: string, projects: ProjectEvidenceItem[]): Promise<void> {
    setLocal(`projects_${uid}`, projects);
    try {
      await setDoc(doc(db, 'projects', uid), { projects, updatedAt: new Date().toISOString() });
    } catch (e) {
      console.warn('Firestore write projects error:', e);
    }
  }

  // 6. Resume
  static async getResume(uid: string): Promise<ResumeData> {
    try {
      const snap = await getDoc(doc(db, 'resumes', uid));
      if (snap.exists()) {
        const data = snap.data() as ResumeData;
        setLocal(`resume_${uid}`, data);
        return data;
      }
    } catch (e) {
      console.warn('Firestore read resume error, using cached:', e);
    }
    return getLocal(`resume_${uid}`, INITIAL_RESUME);
  }

  static async saveResume(uid: string, resume: ResumeData): Promise<void> {
    setLocal(`resume_${uid}`, resume);
    try {
      await setDoc(doc(db, 'resumes', uid), resume);
    } catch (e) {
      console.warn('Firestore write resume error:', e);
    }
  }

  static async createOrUpdateUserProfile(
    uid: string,
    authUser: {
      displayName?: string | null;
      email?: string | null;
      photoURL?: string | null;
      isAnonymous?: boolean;
      onboardingComplete?: boolean;
    }
  ): Promise<UserProfile> {
    const existing = await this.getUserProfile(uid);
    const updated: UserProfile = {
      ...existing,
      uid,
      userId: uid,
      displayName: authUser.displayName || existing.displayName || 'Candidate',
      name: authUser.displayName || existing.displayName || 'Candidate',
      email: authUser.email || existing.email || '',
      photoURL: authUser.photoURL || existing.photoURL || '',
      isAnonymous: authUser.isAnonymous ?? false,
      onboardingComplete:
        authUser.onboardingComplete !== undefined
          ? authUser.onboardingComplete
          : existing.onboardingComplete ?? false,
      lastLoginAt: new Date().toISOString(),
      createdAt: existing.createdAt || new Date().toISOString(),
    };

    await this.saveUserProfile(updated);
    return updated;
  }

  // Migrate anonymous/guest user data to an authenticated Google user UID
  static async migrateUserData(fromUid: string, toUid: string): Promise<void> {
    if (!fromUid || !toUid || fromUid === toUid) return;

    try {
      const role = await this.getTargetRole(fromUid);
      const skills = await this.getUserSkills(fromUid);
      const learning = await this.getLearningPlan(fromUid);
      const projects = await this.getProjects(fromUid);
      const resume = await this.getResume(fromUid);

      await this.saveTargetRole(toUid, role);
      await this.saveUserSkills(toUid, skills);
      await this.saveLearningPlan(toUid, learning);
      await this.saveProjects(toUid, projects);
      await this.saveResume(toUid, resume);
    } catch (err) {
      console.warn('Migration warning:', err);
    }
  }

  // Reset demo data
  static async resetToDemoData(uid: string): Promise<void> {
    setLocal(`skills_${uid}`, INITIAL_DEMO_SKILLS);
    setLocal(`targetRole_${uid}`, DEMO_TARGET_ROLE);
    setLocal(`learningPlan_${uid}`, INITIAL_LEARNING_ITEMS);
    setLocal(`projects_${uid}`, INITIAL_PROJECTS);
    setLocal(`resume_${uid}`, INITIAL_RESUME);

    try {
      await setDoc(doc(db, 'userSkills', uid), { skills: INITIAL_DEMO_SKILLS, updatedAt: new Date().toISOString() });
      await setDoc(doc(db, 'targetRoles', uid), DEMO_TARGET_ROLE);
      await setDoc(doc(db, 'learningPlans', uid), { items: INITIAL_LEARNING_ITEMS, updatedAt: new Date().toISOString() });
      await setDoc(doc(db, 'projects', uid), { projects: INITIAL_PROJECTS, updatedAt: new Date().toISOString() });
      await setDoc(doc(db, 'resumes', uid), INITIAL_RESUME);
    } catch (e) {
      console.warn('Reset sync warning:', e);
    }
  }
}
