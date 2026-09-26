import { UserSkill, SkillGap, PriorityLevel } from '../types';

/**
 * Skill Verification Engine
 * 
 * Formula:
 * demonstrated_score =
 *   10% self claim
 * + 50% assessment
 * + 20% project evidence
 * + 20% interview evidence
 * 
 * Keep confidence separate from demonstrated score.
 * Note: Formula is a weighted heuristics model for MVP demonstration.
 */

export function calculateDemonstratedScore(
  selfClaim: number, // 1 to 5
  assessment: number, // 0 to 100
  project: number, // 0 to 100
  interview: number // 0 to 100
): { score100: number; score5: number } {
  const normalizedSelf = (selfClaim / 5) * 100;
  
  const score100 = Math.round(
    0.10 * normalizedSelf +
    0.50 * assessment +
    0.20 * project +
    0.20 * interview
  );

  const score5 = Number(Math.min(5, Math.max(1, score100 / 20)).toFixed(1));
  return { score100, score5 };
}

export function calculateConfidenceScore(evidence: {
  hasSelfClaim: boolean;
  hasAssessment: boolean;
  hasProject: boolean;
  hasInterview: boolean;
  reassessmentCount?: number;
}): number {
  let confidence = 0;
  if (evidence.hasSelfClaim) confidence += 15;
  if (evidence.hasAssessment) confidence += 40;
  if (evidence.hasProject) confidence += 20;
  if (evidence.hasInterview) confidence += 20;
  if (evidence.reassessmentCount) {
    confidence += Math.min(10, evidence.reassessmentCount * 5);
  }
  return Math.min(98, Math.max(15, confidence));
}

export function computeSkillGap(skill: UserSkill): SkillGap {
  const currentLevel = skill.demonstratedScore;
  const requiredLevel = skill.requiredLevel || 4.0;
  const rawGap = Math.max(0, Number((requiredLevel - currentLevel).toFixed(1)));

  // Determine priority combining gap magnitude and target role importance
  let priorityScore = 0;
  if (skill.importance === 'HIGH') priorityScore += 3;
  else if (skill.importance === 'MEDIUM') priorityScore += 2;
  else priorityScore += 1;

  if (rawGap >= 1.4) priorityScore += 3;
  else if (rawGap >= 0.7) priorityScore += 2;
  else if (rawGap > 0) priorityScore += 1;

  let priority: PriorityLevel = 'LOW';
  if (priorityScore >= 5) priority = 'HIGH';
  else if (priorityScore >= 3) priority = 'MEDIUM';

  return {
    skillName: skill.skillName,
    category: skill.category,
    currentLevel,
    requiredLevel,
    gap: rawGap,
    priority,
    confidence: skill.confidenceScore,
    importance: skill.importance,
  };
}

export function computeRoleAlignment(skills: UserSkill[]): {
  alignmentPercent: number;
  totalGaps: number;
  highPriorityGaps: number;
  verifiedCount: number;
} {
  if (!skills.length) return { alignmentPercent: 0, totalGaps: 0, highPriorityGaps: 0, verifiedCount: 0 };

  let totalWeight = 0;
  let achievedWeight = 0;
  let totalGaps = 0;
  let highPriorityGaps = 0;
  let verifiedCount = 0;

  for (const skill of skills) {
    const weight = skill.importance === 'HIGH' ? 3 : skill.importance === 'MEDIUM' ? 2 : 1;
    totalWeight += weight * (skill.requiredLevel || 4);
    achievedWeight += weight * Math.min(skill.requiredLevel || 4, skill.demonstratedScore);

    const gap = (skill.requiredLevel || 4) - skill.demonstratedScore;
    if (gap > 0.3) {
      totalGaps++;
      if (skill.importance === 'HIGH' || gap >= 1.2) {
        highPriorityGaps++;
      }
    }

    if (skill.confidenceScore >= 70 && skill.demonstratedScore >= (skill.requiredLevel || 4) * 0.8) {
      verifiedCount++;
    }
  }

  const alignmentPercent = Math.round((achievedWeight / Math.max(1, totalWeight)) * 100);
  return { alignmentPercent, totalGaps, highPriorityGaps, verifiedCount };
}
