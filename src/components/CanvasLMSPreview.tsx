import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Inbox,
  Send,
  BookOpen,
  Calendar,
} from 'lucide-react';

export const CanvasLMSPreview: React.FC = () => {
  const { students } = useApp();

  // Find sample student with significant Canvas telemetry (e.g. Jamal Johnson or Diego Hernandez)
  const featured =
    students.find((s) => s.missing_assignments >= 5 && s.lms_logins_last_14_days !== null && s.lms_logins_last_14_days <= 2) ||
    students[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface-1 border border-line rounded-3xl p-6 shadow-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-coral" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Instructure Canvas LMS Connector
            </span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-warn-tint text-warn flex items-center gap-1.5">
            Phase 2 Integration Preview · Simulated Connector
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
            Canvas Learning Management System Integration
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-3xl mt-1 leading-relaxed">
            Canvas course engagement serves as an indispensable early warning signal weeks before final grades post. In Phase 2, Boom AI monitors login frequency and missing assignments, and can deliver counselor-approved messages directly into the student’s Canvas Inbox.
          </p>
        </div>

        {/* Sync indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-line text-xs">
          <div className="p-3 bg-surface-2 rounded-xl border border-line">
            <span className="text-muted">Connector Status</span>
            <div className="font-bold text-ok mt-0.5">Active (Simulated REST API)</div>
          </div>

          <div className="p-3 bg-surface-2 rounded-xl border border-line">
            <span className="text-muted">Telemetry Fields</span>
            <div className="font-bold text-ink mt-0.5">Logins, Missing Tasks, Grades</div>
          </div>

          <div className="p-3 bg-surface-2 rounded-xl border border-line">
            <span className="text-muted">Signal Latency</span>
            <div className="font-bold text-ink mt-0.5">Hourly Cache Refresh</div>
          </div>

          <div className="p-3 bg-surface-2 rounded-xl border border-line">
            <span className="text-muted">Direct Inbox Messaging</span>
            <div className="font-bold text-coral-ink mt-0.5">Phase 2 Enabled</div>
          </div>
        </div>
      </div>

      {/* Featured Student Canvas Telemetry Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Course Engagement Telemetry */}
        <div className="lg:col-span-7 bg-surface-1 border border-line rounded-3xl shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div>
              <h2 className="text-base font-bold text-ink">
                LMS Course Activity: {featured.first_name} {featured.last_name}
              </h2>
              <p className="text-xs text-muted">
                Canvas telemetry feeding Boom AI risk scoring for {featured.program_of_study}
              </p>
            </div>
            <span className="font-mono text-xs text-faint">ID: {featured.student_id}</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-surface-2 rounded-xl border border-line">
              <div className="text-xs text-muted">Last Canvas Login</div>
              <div className="font-bold text-ink mt-1 text-sm">{featured.lms_last_login || 'Unknown'}</div>
              <div className="text-[10px] text-coral-ink font-medium mt-0.5">18 days inactive</div>
            </div>

            <div className="p-3 bg-surface-2 rounded-xl border border-line">
              <div className="text-xs text-muted">Logins in Last 14 Days</div>
              <div className="font-bold text-coral-ink mt-1 text-xl">{featured.lms_logins_last_14_days ?? 0}</div>
              <div className="text-[10px] text-faint">Threshold: ≤ 1 login</div>
            </div>

            <div className="p-3 bg-surface-2 rounded-xl border border-line">
              <div className="text-xs text-muted">Missing Assignments</div>
              <div className="font-bold text-coral-ink mt-1 text-xl">{featured.missing_assignments}</div>
              <div className="text-[10px] text-faint">Across enrolled sections</div>
            </div>
          </div>

          {/* Enrolled Courses Mock */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
              Enrolled Course Sections (Fall 2026)
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-surface-2/60 rounded-xl border border-line flex items-center justify-between">
                <div>
                  <div className="font-bold text-ink">BIOL 1A · Principles of Cell Biology</div>
                  <div className="text-muted text-[11px]">Instructor: Dr. Martinez · 5.0 Units</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-coral-tint text-coral-ink">
                  4 Missing Tasks · Grade: D
                </span>
              </div>

              <div className="p-3 bg-surface-2/60 rounded-xl border border-line flex items-center justify-between">
                <div>
                  <div className="font-bold text-ink">CHEM 1B · General Chemistry II</div>
                  <div className="text-muted text-[11px]">Instructor: Prof. Lee · 5.0 Units</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-coral-tint text-coral-ink">
                  3 Missing Tasks · Grade: F
                </span>
              </div>

              <div className="p-3 bg-surface-2/60 rounded-xl border border-line flex items-center justify-between">
                <div>
                  <div className="font-bold text-ink">ENGL 1A · Composition & Reading</div>
                  <div className="text-muted text-[11px]">Instructor: Prof. Alvarez · 5.0 Units</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-ok-tint text-ok">
                  0 Missing Tasks · Grade: B
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Canvas Inbox Phase 2 Preview */}
        <div className="lg:col-span-5 bg-surface-1 border border-line rounded-3xl shadow-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-line">
            <Inbox className="w-4 h-4 text-coral" />
            <div>
              <h2 className="text-base font-bold text-ink">Canvas Inbox Preview (Phase 2)</h2>
              <p className="text-xs text-muted">Student view of counselor message inside Canvas</p>
            </div>
          </div>

          <div className="bg-surface-2 p-4 rounded-2xl border border-line space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <div className="font-bold text-ink">From: Maya Okoro (Counseling)</div>
              <span className="text-muted text-[11px]">Today at 9:42 AM</span>
            </div>

            <div className="font-semibold text-ink">
              Subject: Checking in on your classes & Spring registration
            </div>

            <p className="text-muted leading-relaxed italic bg-surface-1 p-3 rounded-xl border border-line">
              "Hi {featured.first_name}, it's Maya from Foothill Counseling. I noticed you haven't been on Canvas for a few days and have a couple of assignments marked missing. Is everything okay? I can help connect you with tutoring at the Teaching & Learning Center and check your spring class schedule. Just reply here!"
            </p>

            <div className="pt-2 flex items-center justify-between text-[11px] text-muted">
              <span>Delivery Status: Queued for Phase 2</span>
              <span className="text-ok font-semibold">100% Counselor Controlled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
