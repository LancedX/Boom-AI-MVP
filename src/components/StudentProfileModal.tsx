import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  BookOpen,
  Calendar,
  GraduationCap,
  ShieldAlert,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  History,
  Phone,
  Mail,
  Award,
} from 'lucide-react';

export const StudentProfileModal: React.FC = () => {
  const {
    selectedStudent,
    isProfileOpen,
    closeStudentProfile,
    setSelectedStudent,
    setActiveTab,
    markStudentRegistered,
  } = useApp();

  if (!isProfileOpen || !selectedStudent) return null;

  const s = selectedStudent;
  const isRegistered = s.registered_for_spring === 'Y';
  const hasHold = s.registration_hold === 'Y' || (s.aid_hold_type && s.aid_hold_type !== 'None');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-surface-1 border border-line rounded-3xl shadow-big max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-ink">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-line bg-surface-2 flex items-start justify-between gap-4 flex-shrink-0">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-coral-tint text-coral-ink border border-coral/30 flex items-center justify-center font-bold text-base flex-shrink-0">
              {s.first_name[0]}
              {s.last_name[0]}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
                  {s.first_name} {s.last_name}
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-3 text-muted">
                  ID: {s.student_id}
                </span>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    s.riskTier === 'High'
                      ? 'bg-coral-tint text-coral-ink border border-coral/30'
                      : s.riskTier === 'Medium'
                      ? 'bg-warn-tint text-warn border border-warn/30'
                      : 'bg-ok-tint text-ok border border-ok/30'
                  }`}
                >
                  Score: {s.riskScore} · {s.riskTier} Risk
                </span>
              </div>

              <div className="text-xs sm:text-sm text-muted mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{s.program_of_study}</span>
                <span>·</span>
                <span>Goal: {s.stated_goal}</span>
                <span>·</span>
                <span className="font-medium text-ink">Advisor: {s.assigned_advisor}</span>
              </div>
            </div>
          </div>

          <button
            onClick={closeStudentProfile}
            className="p-2 rounded-xl text-muted hover:text-ink hover:bg-surface-3 transition-colors"
            title="Close profile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 10 Structured Sections */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Action Bar inside modal */}
          <div className="bg-coral-row border border-coral/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-coral-ink flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-coral" />
                <span>Primary Counselor Priority: {s.primaryRiskFactor}</span>
              </div>
              <p className="text-xs text-muted mt-0.5 max-w-xl">
                {s.recommendedNextAction}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  setSelectedStudent(s);
                  closeStudentProfile();
                  setActiveTab('outreach');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-coral text-white hover:bg-coral-ink transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open Outreach Workbench</span>
              </button>

              {!isRegistered && (
                <button
                  onClick={() => markStudentRegistered(s.student_id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-ok text-white hover:bg-green-700 transition-colors shadow-xs"
                  title="Simulate student clearing hold and registering for Spring"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Spring Registered</span>
                </button>
              )}
            </div>
          </div>

          {/* Grid of Sections 1 to 6 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section 1: Personal & Academic Contact Information */}
            <div className="bg-surface-2/60 border border-line rounded-2xl p-4 space-y-2.5">
              <h3 className="font-semibold text-ink flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted">
                <User className="w-3.5 h-3.5" />
                1. Personal & Contact Records
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-muted">Email:</span>
                  <span className="font-medium text-ink flex items-center gap-1">
                    <Mail className="w-3 h-3 text-muted" />
                    {s.email}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-muted">Mobile Phone:</span>
                  <span className="font-medium text-ink flex items-center gap-1">
                    <Phone className="w-3 h-3 text-muted" />
                    {s.phone || 'None on file'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-muted">Program of Study:</span>
                  <span className="font-semibold text-ink">{s.program_of_study}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted">Term Enrolled:</span>
                  <span className="font-medium text-ink">Quarter Term #{s.term_number}</span>
                </div>
              </div>
            </div>

            {/* Section 2: Enrollment Load & Modality */}
            <div className="bg-surface-2/60 border border-line rounded-2xl p-4 space-y-2.5">
              <h3 className="font-semibold text-ink flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted">
                <BookOpen className="w-3.5 h-3.5" />
                2. Enrollment Status & Modality
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-muted">Standing:</span>
                  <span className="font-semibold text-ink">{s.enrollment_status}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-muted">Units Enrolled:</span>
                  <span className={`font-bold ${s.units_enrolled < 12 ? 'text-coral-ink' : 'text-ok'}`}>
                    {s.units_enrolled} units {s.units_enrolled < 12 ? '(Below 12-unit full-time)' : '(Full-time)'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-muted">Course Modality:</span>
                  <span className="font-medium text-ink">{s.modality}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted">Spring 2027 Registration:</span>
                  <span className={`font-semibold ${isRegistered ? 'text-ok' : 'text-coral-ink'}`}>
                    {isRegistered ? 'Registered' : 'Not Registered (0 units)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Academic Performance */}
            <div className="bg-surface-2/60 border border-line rounded-2xl p-4 space-y-2.5">
              <h3 className="font-semibold text-ink flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted">
                <GraduationCap className="w-3.5 h-3.5" />
                3. Academic Performance
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-muted">Cumulative GPA:</span>
                  <span className={`font-bold ${s.cumulative_gpa < 2.0 ? 'text-coral-ink' : 'text-ink'}`}>
                    {s.cumulative_gpa.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-muted">Lowest Current Grade:</span>
                  <span className={`font-semibold ${s.lowest_current_grade === 'F' || s.lowest_current_grade === 'D' ? 'text-coral-ink' : 'text-ink'}`}>
                    Grade {s.lowest_current_grade}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted">Academic Notice:</span>
                  <span className="text-muted">
                    {s.cumulative_gpa < 2.0 ? 'Academic Notice (Probation)' : 'Good Standing'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 4: LMS / Canvas Engagement */}
            <div className="bg-surface-2/60 border border-line rounded-2xl p-4 space-y-2.5">
              <h3 className="font-semibold text-ink flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted">
                <Clock className="w-3.5 h-3.5" />
                4. Canvas LMS Engagement
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-muted">Last Canvas Login:</span>
                  <span className="font-medium text-ink">
                    {s.lms_last_login ? s.lms_last_login : <span className="text-faint italic">Unknown / Unrecorded</span>}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-muted">Logins in Last 14 Days:</span>
                  <span className={`font-semibold ${s.lms_logins_last_14_days === null ? 'text-faint italic' : s.lms_logins_last_14_days <= 1 ? 'text-coral-ink' : 'text-ink'}`}>
                    {s.lms_logins_last_14_days !== null ? `${s.lms_logins_last_14_days} logins` : 'Unknown (No telemetry)'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted">Missing Assignments:</span>
                  <span className={`font-bold ${s.missing_assignments >= 2 ? 'text-coral-ink' : 'text-ok'}`}>
                    {s.missing_assignments} missing tasks
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-faint italic">
                * Note: Missing login telemetry is treated as unknown rather than assumed zero activity.
              </p>
            </div>

            {/* Section 5: Financial Aid & Registration Holds */}
            <div className="bg-surface-2/60 border border-line rounded-2xl p-4 space-y-2.5">
              <h3 className="font-semibold text-ink flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted">
                <ShieldAlert className="w-3.5 h-3.5" />
                5. Financial Aid & Holds
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-muted">Financial Aid Status:</span>
                  <span className="font-semibold text-ink">{s.financial_aid_status}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-muted">Aid Hold Type:</span>
                  <span className={`font-semibold ${s.aid_hold_type && s.aid_hold_type !== 'None' ? 'text-warn' : 'text-muted'}`}>
                    {s.aid_hold_type || 'None'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-muted">Aid Hold Date:</span>
                  <span className="text-muted">{s.aid_hold_since || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted">Registration Hold Active:</span>
                  <span className={`font-bold ${s.registration_hold === 'Y' ? 'text-coral-ink' : 'text-ok'}`}>
                    {s.registration_hold === 'Y' ? 'YES (Blocks enrollment)' : 'NO'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 6 & 7: Advisor Assignment & Outreach History */}
            <div className="bg-surface-2/60 border border-line rounded-2xl p-4 space-y-2.5">
              <h3 className="font-semibold text-ink flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted">
                <History className="w-3.5 h-3.5" />
                6 & 7. Advisor & Outreach History
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-muted">Assigned Advisor:</span>
                  <span className="font-semibold text-ink">{s.assigned_advisor}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-muted">Last Advisor Contact:</span>
                  <span className="text-muted">{s.last_advisor_contact || 'None recorded'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-muted">Previous Outreach Date:</span>
                  <span className="text-muted">{s.last_outreach_date || 'No prior outreach'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted">Outreach Response:</span>
                  <span className={`font-medium ${s.outreach_response ? 'text-ink' : 'text-faint'}`}>
                    {s.outreach_response || 'Awaiting outreach'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 8: Explainable Risk Scoring Breakdown */}
          <div className="bg-surface-1 border border-line rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-ink text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-coral" />
                8. Explainable Risk Score Breakdown (Deterministic Rule Engine)
              </h3>
              <span className="text-xs text-muted font-mono">
                Total Score: <span className="font-bold text-ink">{s.riskScore}</span> / 100+
              </span>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              Every point contributing to this student's score is computed by transparent, versioned rules.
              No black-box AI model assigns priorities or decisions.
            </p>

            <div className="divide-y divide-line border border-line rounded-xl overflow-hidden text-xs">
              {s.riskFactors.length === 0 ? (
                <div className="p-3 text-center text-muted">No active risk factors flagged.</div>
              ) : (
                s.riskFactors.map((factor, i) => (
                  <div key={i} className="p-3 flex items-center justify-between bg-surface-1">
                    <div>
                      <div className="font-semibold text-ink">{factor.name}</div>
                      <div className="text-[11px] text-muted mt-0.5">{factor.description}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-bold bg-coral-tint text-coral-ink">
                      +{factor.points} pts
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 9: Recommended Next Action & Message Draft */}
          <div className="bg-surface-1 border border-line rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="font-semibold text-ink text-sm flex items-center gap-2">
              <Send className="w-4 h-4 text-ok" />
              9. Recommended Action & Suggested Outreach Message
            </h3>

            <div className="p-3.5 bg-surface-2 rounded-xl border border-line space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted">Suggested Outreach Message (8th Grade Level):</span>
                <span className="text-ok font-semibold text-[11px]">Counselor Approved Required</span>
              </div>
              <p className="text-xs sm:text-sm text-ink italic leading-relaxed">
                "{s.suggestedDraft}"
              </p>
            </div>
          </div>

          {/* Section 10: Complete Auditable Timeline */}
          <div className="bg-surface-1 border border-line rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="font-semibold text-ink text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-muted" />
              10. Activity & Synchronization Timeline
            </h3>

            <div className="space-y-3 pl-2">
              {s.timeline.map((event) => (
                <div key={event.id} className="relative pl-5 border-l-2 border-line text-xs space-y-1">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-coral" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">{event.title}</span>
                    <span className="text-[11px] text-faint">
                      {new Date(event.timestamp).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-muted text-[11px]">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-line bg-surface-2 flex items-center justify-between flex-shrink-0">
          <span className="text-xs text-muted">
            Foothill College · Banner SIS ID: {s.student_id}
          </span>
          <button
            onClick={closeStudentProfile}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-1 hover:bg-surface-3 border border-line text-ink transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
