import { describe, it, expect } from 'vitest';
import { calculateStudentRisk, DEFAULT_RULES, DEFAULT_THRESHOLDS } from './riskEngine';
import { Student } from '../types';

describe('Risk Scoring Engine', () => {
  it('correctly flags students with registration holds and un-enrolled status', () => {
    const rawStudent = {
      student_id: 'S100101',
      first_name: 'Jamal',
      last_name: 'Johnson',
      email: 'jamal.johnson@student.example.edu',
      phone: '(555) 012-7924',
      program_of_study: 'Nursing (ADN)',
      stated_goal: 'Transfer to a BSN program',
      enrollment_status: 'Full-time',
      modality: 'Hybrid',
      units_enrolled: 15,
      term_number: 2,
      cumulative_gpa: 2.18,
      lowest_current_grade: 'D',
      lms_last_login: '2026-11-03',
      lms_logins_last_14_days: 0,
      missing_assignments: 8,
      financial_aid_status: 'Pending',
      aid_hold_type: 'Verification documents',
      aid_hold_since: '2026-10-16',
      registration_hold: 'Y' as const,
      registered_for_spring: 'N' as const,
      assigned_advisor: 'T. Brooks',
      last_advisor_contact: '2026-07-29',
      last_outreach_date: '',
      last_outreach_channel: '',
      outreach_response: '',
      outreachState: 'draft' as const,
      outreachChannel: 'SMS' as const,
      weekTwoStatus: 'unregistered' as const,
      timeline: [],
    };

    const risk = calculateStudentRisk(rawStudent, DEFAULT_RULES, DEFAULT_THRESHOLDS);

    // Expect high priority score (hold: 30 + notreg: 25 + fafsa: 20 + canvas: 20 + missing: 15 + gpa: 10 = 120)
    expect(risk.riskScore).toBeGreaterThanOrEqual(50);
    expect(risk.riskTier).toBe('High');
    expect(risk.riskFactors.length).toBeGreaterThan(0);
    expect(risk.primaryRiskFactor).toBeDefined();
    expect(risk.suggestedDraft).toContain('Jamal');
  });

  it('correctly ranks low-risk students into Watch tier', () => {
    const safeStudent = {
      student_id: 'S100138',
      first_name: 'Nia',
      last_name: 'Scott',
      email: 'nia.scott@student.example.edu',
      phone: '(555) 013-4545',
      program_of_study: 'Computer Science',
      stated_goal: 'Transfer to UC',
      enrollment_status: 'Part-time',
      modality: 'Online',
      units_enrolled: 6,
      term_number: 3,
      cumulative_gpa: 3.72,
      lowest_current_grade: 'B',
      lms_last_login: '2026-11-19',
      lms_logins_last_14_days: 21,
      missing_assignments: 0,
      financial_aid_status: 'Awarded',
      aid_hold_type: 'None',
      aid_hold_since: '',
      registration_hold: 'N' as const,
      registered_for_spring: 'Y' as const,
      assigned_advisor: 'K. Singh',
      last_advisor_contact: '2026-10-30',
      last_outreach_date: '',
      last_outreach_channel: '',
      outreach_response: '',
      outreachState: 'draft' as const,
      outreachChannel: 'SMS' as const,
      weekTwoStatus: 'registered' as const,
      timeline: [],
    };

    const risk = calculateStudentRisk(safeStudent, DEFAULT_RULES, DEFAULT_THRESHOLDS);

    // Nia has units < 12 (10 pts), no hold, registered, no aid hold, active on Canvas -> 10 pts
    expect(risk.riskScore).toBeLessThan(30);
    expect(risk.riskTier).toBe('Watch');
  });
});
