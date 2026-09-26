export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface UserSkill {
  skillName: string;
  category: string;
  selfClaimScore: number; // 1 to 5
  assessmentScore: number; // 0 to 100
  projectScore: number; // 0 to 100
  interviewScore: number; // 0 to 100
  demonstratedScore: number; // 1 to 5 (calculated: 0.10*self + 0.50*assessment + 0.20*project + 0.20*interview)
  confidenceScore: number; // 0 to 100%
  requiredLevel: number; // 1 to 5
  importance: PriorityLevel;
  lastUpdated?: string;
  evidenceCount?: number;
}

export interface SkillGap {
  skillName: string;
  category: string;
  currentLevel: number; // e.g. 2.1 (or 42 on 100 scale)
  requiredLevel: number; // e.g. 4.0 (or 80 on 100 scale)
  gap: number; // required - current
  priority: PriorityLevel;
  confidence: number;
  importance: PriorityLevel;
}

export interface ExtractedRoleSkill {
  skill: string;
  category: string;
  importance: PriorityLevel;
  required_level: number;
  description: string;
}

export interface BehavioralSkill {
  skill: string;
  importance: PriorityLevel;
  required_level: number;
  description: string;
}

export interface TargetRoleProfile {
  id: string;
  roleTitle: string;
  company: string;
  jobDescription: string;
  highSkills: ExtractedRoleSkill[];
  mediumSkills: ExtractedRoleSkill[];
  lowSkills: ExtractedRoleSkill[];
  behavioralSkills: BehavioralSkill[];
  summary?: string;
  analyzedAt: string;
}

export type QuestionType = 'mcq' | 'coding' | 'open-ended' | 'scenario';

export interface AssessmentQuestion {
  id: string;
  skill: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctIndex?: number;
  starterCode?: string;
  expectedKeywords?: string[];
  rubric?: string;
  explanation?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface StudentAnswer {
  questionId: string;
  skill: string;
  type: QuestionType;
  answerText: string;
  selectedOptionIndex?: number;
  scoreOutOf100: number;
  feedback?: string;
  isCorrect?: boolean;
}

export interface AssessmentRecord {
  id: string;
  title: string;
  type: 'baseline' | 'prove_skill';
  targetSkill?: string;
  completedAt: string;
  scoreOutOf100: number;
  answers: StudentAnswer[];
  skillBreakdown: Record<string, { score: number; questions: number }>;
}

export type LearningItemStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';

export type ResourcePlatform =
  | 'YouTube'
  | 'freeCodeCamp'
  | 'LeetCode'
  | 'HackerRank'
  | 'Documentation'
  | 'MDN'
  | 'Microsoft Learn'
  | 'AWS Skill Builder'
  | 'Oracle Docs'
  | 'Spring Docs'
  | 'PostgreSQL Docs'
  | 'GeeksforGeeks'
  | 'Coursera'
  | 'edX'
  | 'Khan Academy'
  | 'W3Schools'
  | 'GitHub'
  | 'Interactive';

export interface LearningResource {
  id: string;
  title: string;
  platform: ResourcePlatform;
  type: 'Video' | 'Interactive Practice' | 'Official Docs' | 'Guide' | 'Problem Set' | 'Course';
  url: string;
  creator?: string;
  durationOrReadTime?: string;
  relevanceScore?: number; // 1-100 ranking
  isCompleted?: boolean;
}

export interface LearningItem {
  id: string;
  skill: string;
  topic: string;
  priority: PriorityLevel;
  reason: string;
  estimatedTime: string;
  status: LearningItemStatus;
  prerequisites?: string[];
  actionableObjectives?: string[];
  learningResources: LearningResource[];
  isSearchingResources?: boolean;
}

export interface InterviewTurn {
  id: string;
  turnNumber: number;
  interviewerQuestion: string;
  candidateAnswer: string;
  targetedSkill: string;
  feedback?: string;
  turnScore?: number;
  verificationStatus?: 'VERIFIED_CORRECT' | 'PARTIALLY_CORRECT' | 'EXPLANATION_PROVIDED' | 'INCORRECT';
}

export interface InterviewSession {
  id: string;
  roleTitle: string;
  company: string;
  startedAt: string;
  completedAt?: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  turns: InterviewTurn[];
  evaluation?: {
    overallScore: number;
    technicalScore: number;
    problemSolvingScore: number;
    communicationScore: number;
    projectDepthScore: number;
    roleRelevanceScore: number;
    summary: string;
    strengths: string[];
    weakAreas: Array<{
      skill: string;
      score: number;
      reason: string;
      suggestedTopic: string;
    }>;
  };
}

export interface ProjectEvidenceItem {
  id: string;
  name: string;
  githubUrl: string;
  description: string;
  technologies: string[];
  detectedSkills: Array<{
    skill: string;
    demonstratedLevel: number;
    confidence: number;
    rationale: string;
  }>;
  evidenceNotes: string;
  limitations: string[];
  projectScore: number;
  addedAt: string;
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    highlights: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    techStack: string;
    link?: string;
  }>;
  certifications: string[];
  tailorAnalysis?: {
    matchScore: number;
    disclaimer: string;
    missingKeywords: string[];
    tailorSuggestions: string[];
    strengths: string[];
    analyzedAt: string;
  };
}

export interface UserProfile {
  uid: string;
  userId?: string;
  displayName: string;
  name?: string;
  email: string;
  photoURL?: string;
  targetRole: string;
  targetCompany: string;
  onboardingComplete: boolean;
  createdAt: string;
  lastLoginAt?: string;
  isAnonymous?: boolean;
}
