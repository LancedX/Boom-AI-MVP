import { Student, Counselor, AuditLogEntry, RiskConfig, WalkthroughStep } from '../types';
import { INITIAL_STUDENT_ROWS } from './rawCsvData';
import { parseRawRowToStudent } from './csvParser';
import { DEFAULT_RULES, DEFAULT_THRESHOLDS } from './riskEngine';

export const DEFAULT_COUNSELORS: Counselor[] = [
  {
    id: 'M. Okoro',
    name: 'Maya Okoro',
    role: 'Counselor C-1042 · General & Transfer Counseling',
    email: 'okoromaya@fhda.edu',
    timezone: 'America/Los_Angeles (Pacific Time)',
    status: 'Active',
  },
  {
    id: 'K. Singh',
    name: 'K. Singh',
    role: 'Counselor C-1018 · STEM & Applied Tech',
    email: 'singhk@fhda.edu',
    timezone: 'America/Los_Angeles (Pacific Time)',
    status: 'Active',
  },
  {
    id: 'T. Brooks',
    name: 'T. Brooks',
    role: 'Counselor C-1033 · Health Sciences & Nursing',
    email: 'brookst@fhda.edu',
    timezone: 'America/Los_Angeles (Pacific Time)',
    status: 'Active',
  },
  {
    id: 'R. Alvarez',
    name: 'R. Alvarez',
    role: 'Counselor C-1051 · Pre-Med & Biological Sciences',
    email: 'alvarezr@fhda.edu',
    timezone: 'America/Los_Angeles (Pacific Time)',
    status: 'Active',
  },
];

export function getInitialStudents(): Student[] {
  const students = INITIAL_STUDENT_ROWS.map((row) =>
    parseRawRowToStudent(row as unknown as Record<string, string>, DEFAULT_RULES, DEFAULT_THRESHOLDS)
  );

  // Pre-seed a few states to provide immediate interactivity representing a live counselor's week:
  // 1. One student pre-sent with a response to show Week Two resolution (e.g. Elena Rostova or Yesenia Rivera)
  // 2. High priority students awaiting review (e.g. Aaliyah Williams, Jamal Johnson, Diego Hernandez)
  const yesenia = students.find((s) => s.first_name === 'Yesenia' && s.last_name === 'Rivera');
  if (yesenia) {
    yesenia.outreachState = 'sent';
    yesenia.outreachChannel = 'SMS';
    yesenia.approvedAt = '2026-11-18T10:15:00Z';
    yesenia.studentReply = 'Sent Form — I emailed the financial aid office this morning.';
    yesenia.replyTimestamp = '2026-11-18T14:22:00Z';
    yesenia.weekTwoStatus = 'hold_cleared';
    yesenia.timeline.push({
      id: 't-pre-1',
      timestamp: '2026-11-18T10:15:00Z',
      title: 'SMS Dispatched',
      type: 'counselor',
      description: 'Approved by Maya Okoro via Foothill approved SMS line (555-0144).',
    });
    yesenia.timeline.push({
      id: 't-pre-2',
      timestamp: '2026-11-18T14:22:00Z',
      title: 'Student SMS Reply Received',
      type: 'student',
      description: 'Student confirmed: "Sent Form — I emailed the financial aid office this morning."',
    });
  }

  const diego = students.find((s) => s.first_name === 'Diego' && s.last_name === 'Hernandez');
  if (diego) {
    diego.outreachState = 'awaiting_approval';
  }

  const aaliyah = students.find((s) => s.first_name === 'Aaliyah' && s.last_name === 'Williams');
  if (aaliyah) {
    aaliyah.outreachState = 'awaiting_approval';
  }

  return students;
}

export const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-11-21T02:00:15Z',
    action: 'Nightly SIS Synchronization Completed',
    actor: 'System (Banner Read-Only Connector)',
    details: '50 student records refreshed from Foothill Banner 9 database snapshot. No write-backs attempted.',
    simulated: true,
  },
  {
    id: 'aud-002',
    timestamp: '2026-11-21T06:30:00Z',
    action: 'Explainable Rules Engine Executed',
    actor: 'Boom Engine v1.2',
    details: 'Evaluated 7 deterministic rules across 50 active students. 17 high-priority flags identified.',
    simulated: false,
  },
  {
    id: 'aud-003',
    timestamp: '2026-11-21T07:00:00Z',
    action: 'Weekly Counselor Digest Dispatched',
    actor: 'System Scheduler',
    details: 'Generated and delivered Monday morning briefing to 4 Foothill counselors (Top 15 per caseload).',
    simulated: true,
  },
  {
    id: 'aud-004',
    timestamp: '2026-11-18T10:15:00Z',
    action: 'Counselor Approved Outreach Message',
    actor: 'Maya Okoro (Counselor C-1042)',
    studentId: 'S100134',
    studentName: 'Yesenia Rivera',
    details: 'Approved personalized bursar hold resolution SMS. Sent from verified college shortcode.',
    simulated: false,
  },
  {
    id: 'aud-005',
    timestamp: '2026-11-18T14:22:00Z',
    action: 'Inbound Student SMS Received',
    actor: 'Student Inbound (Telnyx Webhook)',
    studentId: 'S100134',
    studentName: 'Yesenia Rivera',
    details: 'Student replied: "Sent Form — I emailed the financial aid office this morning."',
    simulated: true,
  },
];

export const INITIAL_RULE_CONFIG: RiskConfig = {
  version: 'v1.2',
  updatedAt: '2026-10-01T08:00:00Z',
  rules: DEFAULT_RULES,
  thresholds: DEFAULT_THRESHOLDS,
};

export const RULE_HISTORY: RiskConfig[] = [
  {
    version: 'v1.0',
    updatedAt: '2026-08-15T09:00:00Z',
    rules: DEFAULT_RULES.map((r) => ({ ...r, points: r.points - 5 })),
    thresholds: { high: 45, medium: 25 },
  },
  {
    version: 'v1.1',
    updatedAt: '2026-09-10T11:30:00Z',
    rules: DEFAULT_RULES.map((r) => (r.key === 'canvas' ? { ...r, points: 15 } : r)),
    thresholds: { high: 50, medium: 30 },
  },
  INITIAL_RULE_CONFIG,
];

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 1,
    tab: 'digest',
    title: 'The Monday 7:00 AM Counselor Digest',
    persona: 'Maya Okoro · Foothill Counseling Outlook Inbox',
    explanation:
      'Boom AI delivers one consolidated, actionable Outlook briefing every Monday at 7:00 AM with the top 15 priority students for Maya Okoro. Counselors review clear, plain-language flags rather than digging through raw databases.',
    highlights: [
      'Top 15 students ranked deterministically by risk urgency',
      'One clear next step per student with an 8th-grade reading level draft',
      'Zero action is taken until the counselor explicitly approves',
    ],
    actionPrompt: 'Click on Kelsey Tran or Aaliyah Williams to inspect their drafted outreach.',
  },
  {
    id: 2,
    tab: 'directory',
    title: 'Full Student Cohort & Transparent Indicators',
    persona: 'Counseling & Enrollment Services',
    explanation:
      'Every record from the college SIS is displayed with full transparency. Counselors can filter by hold type, registration status, GPA, or assigned advisor, and immediately open comprehensive student profiles.',
    highlights: [
      'All 50 real student records with verified Banner indicators',
      'Filters for holds, spring registration status, and modality',
      'Clear distinction between recorded institutional facts and calculated scores',
    ],
    actionPrompt: 'Click any student row to view their 10-section comprehensive profile.',
  },
  {
    id: 3,
    tab: 'outreach',
    title: 'Counselor-in-the-Loop Outreach & Phone Simulator',
    persona: 'Maya Okoro · Outreach Workbench',
    explanation:
      'Counselors maintain complete control over student communication. Counselors review the reason, edit the suggested SMS or email, and approve delivery. The interactive phone simulator demonstrates real-time student delivery.',
    highlights: [
      'Editable message drafts with real-time word and reading level indicators',
      'Multi-channel selector: SMS, Email, or Canvas Inbox',
      'Instant interactive smartphone simulation with student quick-replies',
    ],
    actionPrompt: 'Click "Approve & Send SMS" to see the message render inside the student smartphone simulator.',
  },
  {
    id: 4,
    tab: 'weektwo',
    title: 'Student Response & Week Two Resolution',
    persona: 'Enrollment Recovery Cycle',
    explanation:
      'Boom AI tracks the complete student intervention lifecycle into Week Two. When students respond with "Sent Form" or "Need Advisor", holds are queued for release and students are nudged directly into Spring class enrollment.',
    highlights: [
      'Automated response categorization (Hold Cleared vs Needs Appointment)',
      'Banner SIS registration confirmation tracking',
      'Zero dropped handoffs: unresolved students carry forward to the next week',
    ],
    actionPrompt: 'Review how Yesenia Rivera and other students move from flagged to registered.',
  },
  {
    id: 5,
    tab: 'rules',
    title: 'Explainable, Versioned Ranking Rules',
    persona: 'Academic Senate & Counseling Leadership',
    explanation:
      'No black-box AI model decides a student’s fate. Transparent, versioned rules written in plain English assign points. Counselors and administrators can inspect and adjust weights, test threshold changes, and view audit trails.',
    highlights: [
      '100% deterministic rules with auditable math',
      'Adjustable weights and priority thresholds with live cohort recalculation',
      'Version history with instant rollback capability',
    ],
    actionPrompt: 'Toggle a rule or adjust its slider to see how student scores update dynamically.',
  },
  {
    id: 6,
    tab: 'it',
    title: 'IT Architecture, Privacy & Audit Center',
    persona: 'College IT & Registrar',
    explanation:
      'Designed to satisfy rigorous community college IT security standards. Boom AI operates on a non-invasive read-only model (nightly 2:00 AM pull). The audit log tracks every counselor action, with zero student PII sent to external LLMs.',
    highlights: [
      'Three send options (M365 Direct, Drafts folder, or Mailto client with 0 permissions)',
      'Read-only architecture: Boom never writes directly to Banner SIS',
      'Outbound Reconciliation CSV download for bulk SIS record updating',
    ],
    actionPrompt: 'Click "Export Reconciliation CSV" to download the live audit and resolution report.',
  },
  {
    id: 7,
    tab: 'sis',
    title: 'Banner / Ellucian SIS Integration Preview',
    persona: 'Registrar & Systems Analyst',
    explanation:
      'An interactive preview of how Boom AI integrates with Foothill’s Ellucian Banner SIS. Nightly data pulls ingest course registrations, academic standing, and bursar/aid holds without disrupting IT infrastructure.',
    highlights: [
      'Nightly 2:00 AM automated read-only sync',
      'Full field mapping for student records, registration holds, and term units',
      'Zero custom Banner modifications required',
    ],
    actionPrompt: 'Explore the Banner synchronization status and mapped schema fields.',
  },
  {
    id: 8,
    tab: 'canvas',
    title: 'Canvas LMS Integration Preview (Phase 2)',
    persona: 'Academic Technology & Instructional Design',
    explanation:
      'Demonstrates the Canvas LMS integration layer. Course activity, days since last login, and missing assignments are surfaced as early warning indicators. Phase 2 introduces counselor messaging directly into Canvas Inbox.',
    highlights: [
      'Early warning detection: 14+ days inactive or missing assignments',
      'Syncs with Canvas course sections and gradebook',
      'Counselor messages delivered under counselor name inside Canvas',
    ],
    actionPrompt: 'Inspect Canvas engagement telemetry and course-level activity.',
  },
  {
    id: 9,
    tab: 'president',
    title: 'Executive & VP of Student Success Dashboard',
    persona: 'VP of Student Success & College President',
    explanation:
      'Every Friday at 8:00 AM, executive leadership receives an institutional outcome summary. It separates real cohort counts from pilot projections, showing confirmed registrations in Banner and cost per recovered student.',
    highlights: [
      'Real-time enrollment recovery pipeline and hold resolution metrics',
      'Cost per confirmed registration calculated against the $15,000 pilot fee',
      'Strict separation of verified facts versus projected targets',
    ],
    actionPrompt: 'Review the Friday executive briefing and institutional recovery funnel.',
  },
  {
    id: 10,
    tab: 'pilot',
    title: 'Foothill College Spring 2027 Pilot Proposal',
    persona: 'Partnership Agreement & Next Steps',
    explanation:
      'A structured, one-quarter Spring 2027 design partnership for Foothill Community College. Features a $15,000 fixed fee, focused on recovering at-risk continuing students before the drop deadline.',
    highlights: [
      '$15,000 fixed fee for 1 full academic quarter',
      'Target population: 2,000 at-risk continuing students',
      'Concrete success criteria: cleared holds, verified Banner registrations, advisor time saved',
    ],
    actionPrompt: 'Review the pilot timeline, commercial terms, and readiness checklist.',
  },
];
