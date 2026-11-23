import { Student, RiskRule, RiskFactor } from '../types';

export const DEFAULT_RULES: RiskRule[] = [
  {
    id: 'R1',
    key: 'hold',
    name: 'Registration hold',
    conditionDescription: 'Any active hold blocking spring registration or payment obligation',
    points: 30,
    enabled: true,
  },
  {
    id: 'R2',
    key: 'notreg',
    name: 'Not registered for spring',
    conditionDescription: '0 spring units enrolled and priority registration window open',
    points: 25,
    enabled: true,
  },
  {
    id: 'R3',
    key: 'fafsa',
    name: 'FAFSA or CADAA issue',
    conditionDescription: 'Financial aid pending verification documents or not applied',
    points: 20,
    enabled: true,
  },
  {
    id: 'R4',
    key: 'canvas',
    name: 'No Canvas / LMS activity',
    conditionDescription: '14+ days without login or ≤1 login in past 14 days (10 pts if 7–13 days)',
    points: 20,
    enabled: true,
  },
  {
    id: 'R5',
    key: 'missing',
    name: 'Missing course assignments',
    conditionDescription: '2 or more missing assignments across enrolled sections',
    points: 10,
    enabled: true,
  },
  {
    id: 'R6',
    key: 'units',
    name: 'Dropped below 12 units',
    conditionDescription: 'Current enrollment below full-time study threshold (<12 units)',
    points: 10,
    enabled: true,
  },
  {
    id: 'R7',
    key: 'gpa',
    name: 'Academic risk standing',
    conditionDescription: 'Cumulative GPA below 2.0 or current grade D/F',
    points: 15,
    enabled: true,
  },
];

export const DEFAULT_THRESHOLDS = {
  high: 50,
  medium: 30,
};

// Reference current date for the Fall 2026 term context
const CURRENT_DATE = new Date('2026-11-21T00:00:00Z');

export function calculateStudentRisk(
  raw: Omit<Student, 'riskScore' | 'riskTier' | 'riskFactors' | 'primaryRiskFactor' | 'recommendedNextAction' | 'suggestedDraft'>,
  rules: RiskRule[] = DEFAULT_RULES,
  thresholds = DEFAULT_THRESHOLDS
): {
  riskScore: number;
  riskTier: 'High' | 'Medium' | 'Watch';
  riskFactors: RiskFactor[];
  primaryRiskFactor: string;
  recommendedNextAction: string;
  suggestedDraft: string;
} {
  const activeRules = new Map(rules.filter((r) => r.enabled).map((r) => [r.key, r]));
  const factors: RiskFactor[] = [];
  let score = 0;

  // Rule 1: Registration hold
  if (activeRules.has('hold')) {
    const rule = activeRules.get('hold')!;
    const hasHold = raw.registration_hold === 'Y' || (raw.aid_hold_type && raw.aid_hold_type !== 'None');
    if (hasHold) {
      const holdDetail = raw.aid_hold_type && raw.aid_hold_type !== 'None' 
        ? raw.aid_hold_type 
        : 'Academic/Administrative hold';
      score += rule.points;
      factors.push({
        name: rule.name,
        points: rule.points,
        description: `Active registration hold: ${holdDetail}${raw.aid_hold_since ? ` (since ${raw.aid_hold_since})` : ''}`,
        ruleKey: 'hold',
      });
    }
  }

  // Rule 2: Not registered for spring
  if (activeRules.has('notreg')) {
    const rule = activeRules.get('notreg')!;
    if (raw.registered_for_spring === 'N') {
      score += rule.points;
      factors.push({
        name: rule.name,
        points: rule.points,
        description: 'Not yet registered for Spring 2027 classes',
        ruleKey: 'notreg',
      });
    }
  }

  // Rule 3: FAFSA / Financial aid issue
  if (activeRules.has('fafsa')) {
    const rule = activeRules.get('fafsa')!;
    if (raw.aid_hold_type && raw.aid_hold_type !== 'None') {
      score += rule.points;
      factors.push({
        name: rule.name,
        points: rule.points,
        description: `Financial aid hold: ${raw.aid_hold_type}`,
        ruleKey: 'fafsa',
      });
    } else if (raw.financial_aid_status === 'Pending') {
      score += rule.points;
      factors.push({
        name: rule.name,
        points: rule.points,
        description: 'Financial aid package pending verification documentation',
        ruleKey: 'fafsa',
      });
    } else if (raw.financial_aid_status === 'Not applied') {
      const pts = Math.round(rule.points * 0.75);
      score += pts;
      factors.push({
        name: rule.name,
        points: pts,
        description: 'No 2027–28 FAFSA or CADAA application on file',
        ruleKey: 'fafsa',
      });
    }
  }

  // Rule 4: Canvas / LMS inactivity
  if (activeRules.has('canvas')) {
    const rule = activeRules.get('canvas')!;
    let daysInactive: number | null = null;
    if (raw.lms_last_login) {
      const loginDate = new Date(raw.lms_last_login + 'T00:00:00Z');
      daysInactive = Math.floor((CURRENT_DATE.getTime() - loginDate.getTime()) / (1000 * 3600 * 24));
    }

    const logins14 = raw.lms_logins_last_14_days;
    if ((daysInactive !== null && daysInactive >= 14) || (logins14 !== null && logins14 <= 1)) {
      score += rule.points;
      factors.push({
        name: rule.name,
        points: rule.points,
        description: `${daysInactive !== null ? `${daysInactive} days without Canvas login` : 'Critically low LMS logins'} (${logins14 ?? 0} logins in 14 days)`,
        ruleKey: 'canvas',
      });
    } else if ((daysInactive !== null && daysInactive >= 7) || (logins14 !== null && logins14 <= 4)) {
      const pts = Math.round(rule.points * 0.5);
      score += pts;
      factors.push({
        name: 'Moderate LMS inactivity',
        points: pts,
        description: `${daysInactive !== null ? `${daysInactive} days since last Canvas login` : 'Low LMS logins'} (${logins14 ?? 0} logins in 14 days)`,
        ruleKey: 'canvas',
      });
    }
  }

  // Rule 5: Missing assignments
  if (activeRules.has('missing')) {
    const rule = activeRules.get('missing')!;
    if (raw.missing_assignments >= 5) {
      const pts = Math.round(rule.points * 1.5);
      score += pts;
      factors.push({
        name: 'Severe missing coursework',
        points: pts,
        description: `${raw.missing_assignments} assignments missing across current courses`,
        ruleKey: 'missing',
      });
    } else if (raw.missing_assignments >= 2) {
      score += rule.points;
      factors.push({
        name: rule.name,
        points: rule.points,
        description: `${raw.missing_assignments} assignments missing in the last 14 days`,
        ruleKey: 'missing',
      });
    }
  }

  // Rule 6: Units dropped below full-time (12 units)
  if (activeRules.has('units')) {
    const rule = activeRules.get('units')!;
    if (raw.units_enrolled < 12) {
      score += rule.points;
      factors.push({
        name: rule.name,
        points: rule.points,
        description: `Enrolled in ${raw.units_enrolled} units (below 12-unit full-time standing)`,
        ruleKey: 'units',
      });
    }
  }

  // Rule 7: Academic standing (GPA / lowest grade)
  if (activeRules.has('gpa')) {
    const rule = activeRules.get('gpa')!;
    if (raw.cumulative_gpa < 2.0 || raw.lowest_current_grade === 'F') {
      score += rule.points;
      factors.push({
        name: rule.name,
        points: rule.points,
        description: `GPA ${raw.cumulative_gpa.toFixed(2)}, lowest course grade: ${raw.lowest_current_grade}`,
        ruleKey: 'gpa',
      });
    } else if (raw.cumulative_gpa < 2.5 || raw.lowest_current_grade === 'D') {
      const pts = Math.round(rule.points * 0.7);
      score += pts;
      factors.push({
        name: 'Academic warning',
        points: pts,
        description: `GPA ${raw.cumulative_gpa.toFixed(2)}, lowest course grade: ${raw.lowest_current_grade}`,
        ruleKey: 'gpa',
      });
    }
  }

  // Determine risk tier
  let riskTier: 'High' | 'Medium' | 'Watch' = 'Watch';
  if (score >= thresholds.high) {
    riskTier = 'High';
  } else if (score >= thresholds.medium) {
    riskTier = 'Medium';
  }

  // Sort factors descending by points
  factors.sort((a, b) => b.points - a.points);

  const topFactor = factors[0];
  const primaryRiskFactor = topFactor ? topFactor.name : 'Routine check-in';

  // Determine recommended action and draft message
  const { recommendedNextAction, suggestedDraft } = getRecommendedActionAndDraft(
    raw.first_name,
    raw.assigned_advisor,
    topFactor?.ruleKey,
    raw
  );

  return {
    riskScore: score,
    riskTier,
    riskFactors: factors,
    primaryRiskFactor,
    recommendedNextAction,
    suggestedDraft,
  };
}

function getRecommendedActionAndDraft(
  firstName: string,
  advisor: string,
  topRuleKey: string | undefined,
  student: Omit<Student, 'riskScore' | 'riskTier' | 'riskFactors' | 'primaryRiskFactor' | 'recommendedNextAction' | 'suggestedDraft'>
): { recommendedNextAction: string; suggestedDraft: string } {
  const advisorName = advisor ? advisor.replace(/^[A-Z]\.\s*/, '') : 'Counseling';

  switch (topRuleKey) {
    case 'hold':
      return {
        recommendedNextAction:
          'Guide student through steps to clear hold. Email fhprobation@fhda.edu or submit financial verification via Student Portal.',
        suggestedDraft: `Hi ${firstName}, it's ${advisorName} from Foothill Counseling. A hold is currently stopping you from signing up for spring classes. It takes two quick steps to clear: email fhprobation@fhda.edu and complete a short online verification. Want help getting it lifted? Just reply to this text.`,
      };
    case 'notreg':
      return {
        recommendedNextAction: 'Review educational plan and register for Spring 2027 sections before courses reach capacity.',
        suggestedDraft: `Hi ${firstName}, it's ${advisorName} from Foothill Counseling. You haven't signed up for Spring 2027 classes yet, and popular sections are filling up. I can help you select the right classes in 15 minutes. What day works best for you?`,
      };
    case 'fafsa':
      return {
        recommendedNextAction: 'Assist student with submitting required verification documents to the Financial Aid office.',
        suggestedDraft: `Hi ${firstName}, it's ${advisorName} from Foothill Counseling. Your financial aid file needs one or two verification documents to finalize your aid package. Submitting them now protects your enrollment. Want me to walk you through what's missing?`,
      };
    case 'canvas':
      return {
        recommendedNextAction: 'Counselor check-in to identify external obstacles and connect with Foothill tech/retention resources.',
        suggestedDraft: `Hi ${firstName}, it's ${advisorName} from Foothill Counseling. I noticed you haven't been on Canvas for a while. Is everything going okay with your courses? If anything is getting in the way, I'm here to support you. Just reply here.`,
      };
    case 'missing':
      return {
        recommendedNextAction: 'Connect student with Foothill Teaching & Learning Center (TLC) tutoring support this week.',
        suggestedDraft: `Hi ${firstName}, it's ${advisorName} from Foothill Counseling. A couple of assignments are marked missing in your classes. Our Foothill tutors at the TLC can help you catch right up. Would you like me to book a free session for you?`,
      };
    case 'units':
      return {
        recommendedNextAction: 'Review credit load to ensure degree progression and prevent financial aid clawback.',
        suggestedDraft: `Hi ${firstName}, it's ${advisorName} from Foothill Counseling. Your units dropped below full-time this quarter. That can sometimes affect your financial aid or transfer timeline. Let's take a quick look together. Can you meet for 10 minutes this week?`,
      };
    case 'gpa':
      return {
        recommendedNextAction: 'Schedule mid-term academic counseling check-in and explore pass/no-pass or tutoring options.',
        suggestedDraft: `Hi ${firstName}, it's ${advisorName} from Foothill Counseling. I wanted to reach out and see how your current courses are feeling. Let's do a quick check-in to make sure you finish the quarter strong and protect your GPA. When are you free?`,
      };
    default:
      return {
        recommendedNextAction: 'Conduct routine term-end progress review.',
        suggestedDraft: `Hi ${firstName}, it's ${advisorName} from Foothill Counseling checking in on your academic progress. How is everything going this quarter? Let me know if you need anything as registration approaches!`,
      };
  }
}
