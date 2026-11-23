import React from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  MessageSquare,
  FileCheck,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const WeekTwoWorkflow: React.FC = () => {
  const {
    students,
    filteredStudents,
    currentCounselor,
    openStudentProfile,
    setSelectedStudent,
    setActiveTab,
    markStudentRegistered,
  } = useApp();

  // Categorize students in Week Two cycle:
  // 1. Confirmed Spring Registrations (Success)
  const registeredStudents = filteredStudents.filter(
    (s) => s.registered_for_spring === 'Y' && (s.outreachState === 'sent' || !!s.studentReply)
  );

  // 2. Actionable Responses Received (Needs Follow-Up or Verification)
  const respondedStudents = filteredStudents.filter(
    (s) => !!s.studentReply && s.registered_for_spring === 'N'
  );

  // 3. Sent But No Reply Yet (Carried Forward)
  const awaitingReplyStudents = filteredStudents.filter(
    (s) => s.outreachState === 'sent' && !s.studentReply && s.registered_for_spring === 'N'
  );

  // 4. Deferred / Skipped Students (Carried Forward into Week Two)
  const skippedStudents = filteredStudents.filter(
    (s) => s.outreachState === 'skipped' && s.registered_for_spring === 'N'
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-surface-1 border border-line rounded-3xl p-6 shadow-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-ok" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Second-Stage Intervention Lifecycle
            </span>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-surface-2 text-muted border border-line">
            Week Two: Foothill Intervention Cycle
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
            Week Two: Inbound Responses & Registration Recovery
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-3xl mt-1 leading-relaxed">
            Boom AI tracks every student who received outreach into Week Two. When students submit clearance forms or request appointments, their records advance automatically. The system ensures zero dropped handoffs before the Spring registration deadline.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-line">
          <div className="p-3 bg-ok-tint/40 border border-ok/20 rounded-xl">
            <div className="text-xs font-medium text-ok">Spring Registrations</div>
            <div className="text-2xl font-bold text-ok mt-1">{registeredStudents.length}</div>
            <div className="text-[11px] text-ok">Confirmed in Banner SIS</div>
          </div>

          <div className="p-3 bg-surface-2 border border-line rounded-xl">
            <div className="text-xs font-medium text-muted">Responses Received</div>
            <div className="text-2xl font-bold text-ink mt-1">{respondedStudents.length}</div>
            <div className="text-[11px] text-muted">Forms & advisor requests</div>
          </div>

          <div className="p-3 bg-surface-2 border border-line rounded-xl">
            <div className="text-xs font-medium text-muted">Awaiting Student Reply</div>
            <div className="text-2xl font-bold text-ink mt-1">{awaitingReplyStudents.length}</div>
            <div className="text-[11px] text-muted">Outreach active</div>
          </div>

          <div className="p-3 bg-surface-2 border border-line rounded-xl">
            <div className="text-xs font-medium text-muted">Deferred / Carried Forward</div>
            <div className="text-2xl font-bold text-ink mt-1">{skippedStudents.length}</div>
            <div className="text-[11px] text-muted">Carries to next digest</div>
          </div>
        </div>
      </div>

      {/* Group 1: Confirmed Spring Registrations */}
      <div className="bg-surface-1 border border-line rounded-3xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-line bg-ok-tint/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-ok" />
            <div>
              <h2 className="text-base font-bold text-ink">
                1. Confirmed Spring 2027 Registrations ({registeredStudents.length})
              </h2>
              <p className="text-xs text-muted">
                Students who completed enrollment recovery and hold removal via Banner SIS
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-ok text-white">
            Recovered
          </span>
        </div>

        <div className="divide-y divide-line">
          {registeredStudents.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted">
              No students confirmed registered yet. Click "Mark Spring Registered" on any student to simulate confirmation.
            </div>
          ) : (
            registeredStudents.map((student) => (
              <div
                key={student.student_id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-2/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openStudentProfile(student)}
                      className="font-bold text-sm text-ink hover:text-coral transition-colors"
                    >
                      {student.first_name} {student.last_name}
                    </button>
                    <span className="text-xs text-faint font-mono">({student.student_id})</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-ok-tint text-ok">
                      Banner Enrolled
                    </span>
                  </div>
                  <div className="text-xs text-muted flex flex-wrap items-center gap-2">
                    <span>{student.program_of_study}</span>
                    <span>·</span>
                    <span>12+ units enrolled</span>
                    <span>·</span>
                    <span className="text-ok font-medium">Holds Released</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-ok font-medium bg-ok-tint px-3 py-1.5 rounded-lg border border-ok/20">
                    Registration Verified
                  </span>
                  <button
                    onClick={() => openStudentProfile(student)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-line hover:bg-surface-2 text-ink font-medium"
                  >
                    View History
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Group 2: Actionable Responses Awaiting Counselor Follow-Up */}
      <div className="bg-surface-1 border border-line rounded-3xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-line bg-surface-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-coral" />
            <div>
              <h2 className="text-base font-bold text-ink">
                2. Inbound Student Responses Awaiting Resolution ({respondedStudents.length})
              </h2>
              <p className="text-xs text-muted">
                Students who replied to counselor outreach and need verification or 1-on-1 booking
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-coral-tint text-coral-ink">
            Action Needed
          </span>
        </div>

        <div className="divide-y divide-line">
          {respondedStudents.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted">
              No inbound responses awaiting resolution. Simulate replies in the Outreach & SMS Simulator.
            </div>
          ) : (
            respondedStudents.map((student) => (
              <div
                key={student.student_id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-surface-2/40 transition-colors"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openStudentProfile(student)}
                      className="font-bold text-sm text-ink hover:text-coral transition-colors"
                    >
                      {student.first_name} {student.last_name}
                    </button>
                    <span className="text-xs text-faint font-mono">({student.student_id})</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-coral-tint text-coral-ink">
                      {student.riskTier} Risk
                    </span>
                  </div>

                  {/* Student Reply Bubble */}
                  <div className="p-3 bg-surface-2 rounded-xl border border-line text-xs">
                    <span className="font-semibold text-ink">Student Reply: </span>
                    <span className="italic text-ink-light">"{student.studentReply}"</span>
                  </div>

                  <div className="text-xs text-muted flex items-center gap-3">
                    <span>{student.program_of_study}</span>
                    <span>·</span>
                    <span>{student.aid_hold_type || 'Academic Hold'}</span>
                    <span>·</span>
                    <span className="text-coral-ink font-medium">Unregistered for Spring</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => markStudentRegistered(student.student_id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-ok text-white hover:bg-green-700 transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm Banner Registration</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedStudent(student);
                      setActiveTab('outreach');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-line bg-surface-1 hover:bg-surface-2 text-ink"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-muted" />
                    <span>Reply via SMS</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Group 3: Deferred / Carried Forward Students */}
      <div className="bg-surface-1 border border-line rounded-3xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-line bg-surface-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-muted" />
            <div>
              <h2 className="text-base font-bold text-ink">
                3. Deferred Students Carried Forward ({skippedStudents.length})
              </h2>
              <p className="text-xs text-muted">
                Students skipped in previous digests. Automatically reappears in the next Monday briefing.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-surface-3 text-muted">
            Next Digest
          </span>
        </div>

        <div className="divide-y divide-line">
          {skippedStudents.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted">
              No students currently deferred.
            </div>
          ) : (
            skippedStudents.map((student) => (
              <div
                key={student.student_id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-ink">
                    {student.first_name} {student.last_name}{' '}
                    <span className="text-faint font-mono font-normal">({student.student_id})</span>
                  </div>
                  <div className="text-muted mt-0.5">
                    Deferred Reason: <b className="text-ink">{student.skipReason || 'Deferred'}</b>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedStudent(student);
                    setActiveTab('outreach');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-line hover:bg-surface-2 font-medium text-ink"
                >
                  Reinstate Outreach
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
