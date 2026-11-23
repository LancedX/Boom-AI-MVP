export interface RiskFactor {
  name: string;
  points: number;
  description: string;
  ruleKey: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  type: 'system' | 'counselor' | 'student' | 'sync';
  description: string;
}

export interface Student {
  // Raw CSV fields
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  program_of_study: string;
  stated_goal: string;
  enrollment_status: string; // Full-time / Part-time
  modality: string; // Online / Hybrid / In-person
  units_enrolled: number;
  term_number: number;
  cumulative_gpa: number;
  lowest_current_grade: string;
  lms_last_login: string;
  lms_logins_last_14_days: number | null;
  missing_assignments: number;
  financial_aid_status: string; // Awarded / Pending / Not applied
  aid_hold_type: string; // None / Verification documents / Unpaid balance / Missing document
  aid_hold_since: string;
  registration_hold: 'Y' | 'N';
  registered_for_spring: 'Y' | 'N';
  assigned_advisor: string;
  last_advisor_contact: string;
  last_outreach_date: string;
  last_outreach_channel: string;
  outreach_response: string;

  // Calculated & Workflow State
  riskScore: number;
  riskTier: 'High' | 'Medium' | 'Watch';
  riskFactors: RiskFactor[];
  primaryRiskFactor: string;
  recommendedNextAction: string;
  suggestedDraft: string;
  outreachState: 'draft' | 'awaiting_approval' | 'approved' | 'sent' | 'skipped';
  outreachChannel: 'SMS' | 'Email' | 'Canvas';
  customDraft?: string;
  approvedAt?: string;
  skipReason?: string;
  studentReply?: string;
  replyTimestamp?: string;
  weekTwoStatus: 'unregistered' | 'registered' | 'hold_cleared' | 'needs_counselor' | 'pending';
  timeline: TimelineEvent[];
}

export interface RiskRule {
  id: string;
  key: string;
  name: string;
  conditionDescription: string;
  points: number;
  enabled: boolean;
}

export interface RiskConfig {
  version: string;
  updatedAt: string;
  rules: RiskRule[];
  thresholds: {
    high: number;
    medium: number;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  studentId?: string;
  studentName?: string;
  details: string;
  simulated: boolean;
}

export interface Counselor {
  id: string;
  name: string;
  role: string;
  email: string;
  timezone: string;
  status: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'directory'
  | 'digest'
  | 'outreach'
  | 'weektwo'
  | 'rules'
  | 'settings'
  | 'it'
  | 'sis'
  | 'canvas'
  | 'crm'
  | 'president'
  | 'pilot';

export interface WalkthroughStep {
  id: number;
  tab: ActiveTab;
  title: string;
  persona: string;
  explanation: string;
  highlights: string[];
  actionPrompt?: string;
}
