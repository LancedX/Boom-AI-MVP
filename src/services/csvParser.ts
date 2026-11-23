import Papa from 'papaparse';
import { Student, RiskRule, TimelineEvent } from '../types';
import { calculateStudentRisk, DEFAULT_RULES, DEFAULT_THRESHOLDS } from './riskEngine';
import { RawStudentRow } from './rawCsvData';

export const REQUIRED_COLUMNS = [
  'student_id',
  'first_name',
  'last_name',
  'email',
  'phone',
  'program_of_study',
  'stated_goal',
  'enrollment_status',
  'modality',
  'units_enrolled',
  'term_number',
  'cumulative_gpa',
  'lowest_current_grade',
  'lms_last_login',
  'lms_logins_last_14_days',
  'missing_assignments',
  'financial_aid_status',
  'aid_hold_type',
  'aid_hold_since',
  'registration_hold',
  'registered_for_spring',
  'assigned_advisor',
  'last_advisor_contact',
  'last_outreach_date',
  'last_outreach_channel',
  'outreach_response',
];

export interface CSVValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  rowCount: number;
  data: Student[];
}

export function parseRawRowToStudent(
  row: Record<string, string>,
  rules: RiskRule[] = DEFAULT_RULES,
  thresholds = DEFAULT_THRESHOLDS
): Student {
  const units_enrolled = parseFloat(row.units_enrolled || '0') || 0;
  const term_number = parseInt(row.term_number || '1', 10) || 1;
  const cumulative_gpa = parseFloat(row.cumulative_gpa || '0') || 0;
  const lms_logins_last_14_days =
    row.lms_logins_last_14_days !== '' && row.lms_logins_last_14_days !== undefined
      ? parseInt(row.lms_logins_last_14_days, 10)
      : null;
  const missing_assignments = parseInt(row.missing_assignments || '0', 10) || 0;

  const rawStudent = {
    student_id: row.student_id?.trim() || `S${Math.floor(100000 + Math.random() * 900000)}`,
    first_name: row.first_name?.trim() || '',
    last_name: row.last_name?.trim() || '',
    email: row.email?.trim() || '',
    phone: row.phone?.trim() || '',
    program_of_study: row.program_of_study?.trim() || 'General Studies',
    stated_goal: row.stated_goal?.trim() || 'Degree completion',
    enrollment_status: row.enrollment_status?.trim() || 'Full-time',
    modality: row.modality?.trim() || 'In-person',
    units_enrolled,
    term_number,
    cumulative_gpa,
    lowest_current_grade: row.lowest_current_grade?.trim() || 'N/A',
    lms_last_login: row.lms_last_login?.trim() || '',
    lms_logins_last_14_days,
    missing_assignments,
    financial_aid_status: row.financial_aid_status?.trim() || 'Not applied',
    aid_hold_type: row.aid_hold_type?.trim() || 'None',
    aid_hold_since: row.aid_hold_since?.trim() || '',
    registration_hold: (row.registration_hold?.trim() === 'Y' ? 'Y' : 'N') as 'Y' | 'N',
    registered_for_spring: (row.registered_for_spring?.trim() === 'Y' ? 'Y' : 'N') as 'Y' | 'N',
    assigned_advisor: row.assigned_advisor?.trim() || 'M. Okoro',
    last_advisor_contact: row.last_advisor_contact?.trim() || '',
    last_outreach_date: row.last_outreach_date?.trim() || '',
    last_outreach_channel: row.last_outreach_channel?.trim() || 'SMS',
    outreach_response: row.outreach_response?.trim() || '',
    outreachState: (row.last_outreach_date ? 'sent' : 'draft') as Student['outreachState'],
    outreachChannel: 'SMS' as const,
    weekTwoStatus: (row.registered_for_spring === 'Y' ? 'registered' : 'unregistered') as Student['weekTwoStatus'],
    timeline: [
      {
        id: 't-1',
        timestamp: '2026-11-21T02:00:00Z',
        title: 'SIS Nightly Ingestion',
        type: 'sync',
        description: 'Record read from Banner SIS nightly feed (read-only snapshot).',
      },
    ] as TimelineEvent[],
  };

  const risk = calculateStudentRisk(rawStudent, rules, thresholds);

  if (rawStudent.outreach_response) {
    rawStudent.timeline.push({
      id: 't-2',
      timestamp: rawStudent.last_outreach_date || '2026-11-10T14:30:00Z',
      title: 'Previous Outreach Recorded',
      type: 'counselor' as const,
      description: `Outreach via ${rawStudent.last_outreach_channel || 'Email'}. Status: ${rawStudent.outreach_response}`,
    });
  }

  return {
    ...rawStudent,
    ...risk,
  };
}

export function parseStudentCSV(
  csvContent: string,
  rules: RiskRule[] = DEFAULT_RULES,
  thresholds = DEFAULT_THRESHOLDS
): CSVValidationResult {
  const result = Papa.parse<Record<string, string>>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  const errors: string[] = [];
  const warnings: string[] = [];

  if (result.errors && result.errors.length > 0) {
    result.errors.forEach((err) => {
      errors.push(`Row ${err.row || 'unknown'}: ${err.message}`);
    });
  }

  const fields = result.meta.fields || [];
  const missingRequired = REQUIRED_COLUMNS.filter((col) => !fields.includes(col));
  if (missingRequired.length > 0) {
    warnings.push(`Missing suggested columns: ${missingRequired.join(', ')}. Default values were assigned.`);
  }

  const seenIds = new Set<string>();
  const students: Student[] = [];

  result.data.forEach((row, idx) => {
    if (!row.student_id && !row.first_name && !row.last_name) {
      warnings.push(`Skipped empty row at index ${idx + 1}`);
      return;
    }

    const id = row.student_id?.trim();
    if (id && seenIds.has(id)) {
      warnings.push(`Duplicate student ID detected: ${id} at row ${idx + 1}. Merging.`);
    } else if (id) {
      seenIds.add(id);
    }

    try {
      const student = parseRawRowToStudent(row, rules, thresholds);
      students.push(student);
    } catch (e: any) {
      errors.push(`Error parsing row ${idx + 1}: ${e.message}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    rowCount: students.length,
    data: students,
  };
}

export function exportReconciliationCSV(students: Student[]): void {
  const headers = [
    'student_id',
    'student_name',
    'hold_type',
    'initial_status',
    'final_status',
    'outcome_achieved',
    'last_interaction_timestamp',
  ];

  const rows = students.map((s) => {
    const student_name = `${s.first_name} ${s.last_name}`.trim();
    const hold_type = s.aid_hold_type && s.aid_hold_type !== 'None' ? s.aid_hold_type : (s.registration_hold === 'Y' ? 'Academic Notice' : 'None');
    const initial_status = s.registered_for_spring === 'Y' ? 'Registered' : (s.registration_hold === 'Y' ? 'Pending Advisor Review' : 'Unregistered');
    
    let final_status = initial_status;
    let outcome_achieved = '';

    if (s.outreachState === 'sent') {
      final_status = 'Agent Outreach Active';
      outcome_achieved = 'Counselor message dispatched via ' + s.outreachChannel;
    }
    if (s.studentReply) {
      if (s.studentReply.includes('Form') || s.studentReply.includes('registered') || s.studentReply.includes('cleared')) {
        final_status = 'Resolution Form Submitted';
        outcome_achieved = 'Verification documents received; hold release queued';
      } else {
        final_status = 'Needs Advisor Intervention';
        outcome_achieved = 'Student requested 1-on-1 counseling appointment';
      }
    }
    if (s.weekTwoStatus === 'registered') {
      final_status = 'Registered for Spring';
      outcome_achieved = 'Banner SIS confirmed 12+ spring units enrolled';
    } else if (s.weekTwoStatus === 'hold_cleared') {
      final_status = 'Hold Cleared';
      outcome_achieved = 'Registration hold cleared; pending section selection';
    }

    const last_interaction_timestamp = s.replyTimestamp || s.approvedAt || '2026-11-21T02:00:00Z';

    return [
      s.student_id,
      student_name,
      hold_type,
      initial_status,
      final_status,
      outcome_achieved,
      last_interaction_timestamp,
    ];
  });

  const csvString = Papa.unparse({
    fields: headers,
    data: rows,
  });

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `enrollment_recovery_results_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
