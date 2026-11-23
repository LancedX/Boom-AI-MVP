import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GitBranch,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  Send,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export const CRMPreview: React.FC = () => {
  const { students, selectedStudent } = useApp();

  const currentStudent =
    selectedStudent ||
    students.find((s) => s.outreachState === 'sent' || !!s.studentReply) ||
    students[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface-1 border border-line rounded-3xl p-6 shadow-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-coral" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Element451 / Slate CRM Integration Preview
            </span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-2 border border-line text-muted">
            Optional Bidirectional Sync · IDs and Events Only
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
            Institutional CRM Student Touchpoint Timeline
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-3xl mt-1 leading-relaxed">
            Boom AI sits alongside institutional CRMs like Element451 or Slate without replacing them. Every risk flag, counselor approval, SMS dispatch, and student response is synchronized as an event so admissions, financial aid, and counseling share one unified history.
          </p>
        </div>

        {/* Status bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-line text-xs">
          <div className="p-3 bg-surface-2 rounded-xl border border-line">
            <span className="text-muted">CRM Platform</span>
            <div className="font-bold text-ink mt-0.5">Element451 / Slate</div>
          </div>

          <div className="p-3 bg-surface-2 rounded-xl border border-line">
            <span className="text-muted">Event Privacy</span>
            <div className="font-bold text-ok mt-0.5">Events & IDs Only (No Text)</div>
          </div>

          <div className="p-3 bg-surface-2 rounded-xl border border-line">
            <span className="text-muted">Sync Mode</span>
            <div className="font-bold text-ink mt-0.5">Webhook Event Stream</div>
          </div>

          <div className="p-3 bg-surface-2 rounded-xl border border-line">
            <span className="text-muted">Touchpoint Duplication</span>
            <div className="font-bold text-coral-ink mt-0.5">De-duplicated</div>
          </div>
        </div>
      </div>

      {/* CRM Student Record View */}
      <div className="bg-surface-1 border border-line rounded-3xl shadow-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
          <div>
            <span className="text-xs font-semibold text-muted uppercase">Student CRM Record</span>
            <h2 className="text-xl font-bold text-ink mt-0.5">
              {currentStudent.first_name} {currentStudent.last_name}
            </h2>
            <div className="text-xs text-muted flex items-center gap-2 mt-0.5">
              <span className="font-mono">CRM ID: CRM-{currentStudent.student_id}</span>
              <span>·</span>
              <span>Banner ID: {currentStudent.student_id}</span>
              <span>·</span>
              <span>Program: {currentStudent.program_of_study}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                currentStudent.registered_for_spring === 'Y'
                  ? 'bg-ok-tint text-ok'
                  : 'bg-coral-tint text-coral-ink'
              }`}
            >
              {currentStudent.registered_for_spring === 'Y' ? 'Enrolled for Spring' : 'Pending Enrollment'}
            </span>
          </div>
        </div>

        {/* CRM Synchronized Activity Stream */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
            Synchronized Timeline Touchpoints
          </h3>

          <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-line">
            {/* Event 1: Registration or Hold Update */}
            {currentStudent.registered_for_spring === 'Y' && (
              <div className="relative text-xs space-y-1">
                <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-ok ring-4 ring-ok-tint" />
                <div className="flex items-center justify-between font-semibold text-ink">
                  <span>Spring 2027 Registration Confirmed</span>
                  <span className="text-[11px] text-faint">Today</span>
                </div>
                <p className="text-muted">
                  Banner SIS webhook confirmed student enrollment in 12+ spring quarter units.
                </p>
              </div>
            )}

            {/* Event 2: Student Reply */}
            {currentStudent.studentReply && (
              <div className="relative text-xs space-y-1">
                <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-warn ring-4 ring-warn-tint" />
                <div className="flex items-center justify-between font-semibold text-ink">
                  <span>Student SMS Response Inbound</span>
                  <span className="text-[11px] text-faint">
                    {currentStudent.replyTimestamp ? new Date(currentStudent.replyTimestamp).toLocaleTimeString() : 'Recent'}
                  </span>
                </div>
                <p className="text-muted">
                  Inbound message logged: resolution form submitted or appointment requested.
                </p>
              </div>
            )}

            {/* Event 3: Outreach Dispatched */}
            {currentStudent.outreachState === 'sent' && (
              <div className="relative text-xs space-y-1">
                <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-coral ring-4 ring-coral-tint" />
                <div className="flex items-center justify-between font-semibold text-ink">
                  <span>Counselor Outreach Dispatched ({currentStudent.outreachChannel})</span>
                  <span className="text-[11px] text-faint">
                    {currentStudent.approvedAt ? new Date(currentStudent.approvedAt).toLocaleTimeString() : 'Recent'}
                  </span>
                </div>
                <p className="text-muted">
                  Counselor {currentStudent.assigned_advisor} approved and sent intervention notice regarding {currentStudent.primaryRiskFactor}.
                </p>
              </div>
            )}

            {/* Event 4: Boom AI Prioritization */}
            <div className="relative text-xs space-y-1">
              <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-ink ring-4 ring-surface-3" />
              <div className="flex items-center justify-between font-semibold text-ink">
                <span>Boom AI Risk Flag Identified</span>
                <span className="text-[11px] text-faint">Nightly Run</span>
              </div>
              <p className="text-muted">
                Student flagged with priority score {currentStudent.riskScore} ({currentStudent.riskTier} Risk). Contributed by: {currentStudent.primaryRiskFactor}.
              </p>
            </div>

            {/* Event 5: Nightly SIS Ingestion */}
            <div className="relative text-xs space-y-1">
              <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-muted ring-4 ring-surface-3" />
              <div className="flex items-center justify-between font-semibold text-ink">
                <span>Banner SIS Nightly Snapshot</span>
                <span className="text-[11px] text-faint">02:00 AM PST</span>
              </div>
              <p className="text-muted">
                Read-only ingest: {currentStudent.units_enrolled} units enrolled, GPA {currentStudent.cumulative_gpa.toFixed(2)}, hold status: {currentStudent.registration_hold}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
