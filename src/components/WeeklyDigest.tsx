import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import {
  Mail,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Send,
  MessageSquare,
  AlertCircle,
  FileEdit,
  RotateCcw,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const WeeklyDigest: React.FC = () => {
  const {
    filteredStudents,
    currentCounselor,
    settings,
    openStudentProfile,
    setSelectedStudent,
    setActiveTab,
    approveOutreach,
    skipOutreach,
  } = useApp();

  const [skipModalStudent, setSkipModalStudent] = useState<Student | null>(null);
  const [skipReason, setSkipReason] = useState('Already contacted via phone');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editedDraft, setEditedDraft] = useState('');

  // Top N students for the digest (default 15)
  const digestStudents = [...filteredStudents]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, settings.topN);

  const approvedCount = digestStudents.filter((s) => s.outreachState === 'sent').length;
  const skippedCount = digestStudents.filter((s) => s.outreachState === 'skipped').length;
  const pendingCount = digestStudents.length - approvedCount - skippedCount;

  const handleApprove = (student: Student) => {
    approveOutreach(student.student_id, 'SMS');
  };

  const handleConfirmSkip = () => {
    if (skipModalStudent) {
      skipOutreach(skipModalStudent.student_id, skipReason);
      setSkipModalStudent(null);
    }
  };

  const handleSaveEdit = () => {
    if (editingStudent) {
      approveOutreach(editingStudent.student_id, 'SMS', editedDraft);
      setEditingStudent(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Outlook / M365 Email Container Frame */}
      <div className="bg-surface-1 border border-line rounded-3xl shadow-card overflow-hidden">
        {/* Email Header Simulation */}
        <div className="bg-surface-2 p-5 sm:p-6 border-b border-line space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
              <Mail className="w-4 h-4 text-coral" />
              <span>Microsoft Outlook · Foothill Counseling Inbound</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-surface-3 text-muted font-medium">
              Every {settings.sendDay} · {settings.sendTime} Pacific
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
              Weekly Priority Student Briefing: Top {settings.topN} Students
            </h1>
            <div className="text-xs sm:text-sm text-muted flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>To: <b className="text-ink">{currentCounselor.name}</b> ({currentCounselor.email})</span>
              <span>·</span>
              <span>Caseload: <b className="text-ink">{filteredStudents.length} Assigned Students</b></span>
            </div>
          </div>

          {/* Action progress bar */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-line/60 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-ok" />
                <span className="font-semibold text-ink">{approvedCount}</span>
                <span className="text-muted">Approved & Sent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-warn" />
                <span className="font-semibold text-ink">{skippedCount}</span>
                <span className="text-muted">Deferred</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-coral animate-pulse" />
                <span className="font-semibold text-coral-ink">{pendingCount}</span>
                <span className="text-muted">Awaiting Your Action</span>
              </div>
            </div>

            {pendingCount > 0 && (
              <button
                onClick={() => {
                  digestStudents
                    .filter((s) => s.outreachState !== 'sent' && s.outreachState !== 'skipped')
                    .forEach((s) => approveOutreach(s.student_id, 'SMS'));
                }}
                className="text-xs font-semibold text-coral hover:text-coral-ink underline text-left"
              >
                Approve All Remaining ({pendingCount})
              </button>
            )}
          </div>
        </div>

        {/* Digest Guidance Callout */}
        <div className="p-4 bg-coral-row border-b border-coral/20 text-xs text-muted flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <b className="text-ink">Counselor Human-in-the-Loop Guarantee:</b> Boom AI prepares message drafts based on versioned risk rules, but zero communications are transmitted without your explicit click. Each message is crafted at an 8th-grade reading level to ensure clear, supportive student communication.
          </p>
        </div>

        {/* Digest Student Rows */}
        <div className="divide-y divide-line">
          {digestStudents.map((student, idx) => {
            const isApproved = student.outreachState === 'sent';
            const isSkipped = student.outreachState === 'skipped';
            const hasReply = !!student.studentReply;

            return (
              <div
                key={student.student_id}
                className={`p-5 transition-colors ${
                  isApproved
                    ? 'bg-ok-tint/20'
                    : isSkipped
                    ? 'bg-surface-2/40 opacity-70'
                    : 'hover:bg-surface-2/50'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left: Student Information & Why Flagged */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-surface-3 text-ink font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <button
                        onClick={() => openStudentProfile(student)}
                        className="font-bold text-sm sm:text-base text-ink hover:text-coral transition-colors flex items-center gap-1.5"
                      >
                        <span>{student.first_name} {student.last_name}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-muted" />
                      </button>
                      <span className="text-xs font-mono text-faint">
                        ({student.student_id})
                      </span>

                      {/* Status Badges */}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          student.riskTier === 'High'
                            ? 'bg-coral-tint text-coral-ink'
                            : 'bg-warn-tint text-warn'
                        }`}
                      >
                        Risk Score: {student.riskScore}
                      </span>

                      {isApproved && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-ok-tint text-ok">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approved & Sent
                        </span>
                      )}

                      {isSkipped && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-3 text-muted">
                          <RotateCcw className="w-3.5 h-3.5" />
                          Deferred ({student.skipReason || 'Deferred'})
                        </span>
                      )}

                      {hasReply && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-ok-tint text-ok animate-pulse">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Student Replied
                        </span>
                      )}
                    </div>

                    {/* Program & Facts */}
                    <div className="text-xs text-muted flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span>{student.program_of_study}</span>
                      <span>·</span>
                      <span>{student.units_enrolled} units ({student.modality})</span>
                      <span>·</span>
                      <span>GPA: {student.cumulative_gpa.toFixed(2)}</span>
                      <span>·</span>
                      <span>Spring '27: <b className={student.registered_for_spring === 'Y' ? 'text-ok' : 'text-coral-ink'}>{student.registered_for_spring === 'Y' ? 'Registered' : 'Not Registered'}</b></span>
                    </div>

                    {/* Why Flagged (Explainable reason) */}
                    <div className="p-3 bg-surface-2 rounded-xl border border-line text-xs space-y-1">
                      <div className="font-semibold text-ink flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-coral" />
                        <span>Why Flagged:</span>
                        <span className="font-normal text-ink-light">
                          {student.riskFactors.map((f) => f.name).join(' · ')}
                        </span>
                      </div>
                      <div className="text-muted">
                        <span className="font-medium text-ink">Action Step: </span>
                        {student.recommendedNextAction}
                      </div>
                    </div>

                    {/* Pre-compiled Drafted Message */}
                    <div className="p-3 bg-surface-1 rounded-xl border border-line text-xs space-y-1">
                      <div className="flex items-center justify-between text-muted text-[11px]">
                        <span className="font-semibold uppercase tracking-wider">Suggested SMS Draft</span>
                        <span className="text-ok font-medium">8th Grade Reading Level Verified</span>
                      </div>
                      <p className="text-xs text-ink italic leading-relaxed">
                        "{student.customDraft || student.suggestedDraft}"
                      </p>
                    </div>

                    {/* If replied, show reply */}
                    {hasReply && (
                      <div className="p-3 bg-ok-tint/40 rounded-xl border border-ok/30 text-xs">
                        <span className="font-bold text-ok">Student Inbound Response: </span>
                        <span className="text-ink font-medium">"{student.studentReply}"</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Counselor Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2 flex-shrink-0 lg:w-44">
                    {!isApproved ? (
                      <>
                        <button
                          onClick={() => handleApprove(student)}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-coral text-white hover:bg-coral-ink transition-colors shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Approve & Send</span>
                        </button>

                        <button
                          onClick={() => {
                            setEditingStudent(student);
                            setEditedDraft(student.customDraft || student.suggestedDraft);
                          }}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-surface-1 hover:bg-surface-2 border border-line text-ink transition-colors"
                        >
                          <FileEdit className="w-3.5 h-3.5 text-muted" />
                          <span>Edit Draft</span>
                        </button>

                        <button
                          onClick={() => setSkipModalStudent(student)}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted hover:text-ink hover:bg-surface-2 transition-colors"
                        >
                          <span>Skip / Defer</span>
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-3 rounded-xl bg-ok-tint text-ok text-xs font-medium space-y-1">
                        <CheckCircle className="w-5 h-5 mx-auto" />
                        <div>Dispatched via SMS</div>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setActiveTab('outreach');
                          }}
                          className="text-[11px] underline text-ok font-semibold hover:text-green-800"
                        >
                          Open Phone View
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Draft Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-line rounded-3xl shadow-big max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-ink">
              Edit Outreach Message for {editingStudent.first_name} {editingStudent.last_name}
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted uppercase">Message Content (SMS)</label>
              <textarea
                rows={4}
                value={editedDraft}
                onChange={(e) => setEditedDraft(e.target.value)}
                className="w-full p-3 bg-surface-2 border border-line rounded-xl text-xs sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral"
              />
              <div className="flex justify-between text-[11px] text-muted">
                <span>Reading level: 8th grade</span>
                <span>{editedDraft.length} characters (1 SMS segment)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-line hover:bg-surface-2 text-ink"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-coral text-white hover:bg-coral-ink"
              >
                Approve & Send Edited Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skip/Defer Reason Modal */}
      {skipModalStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-line rounded-3xl shadow-big max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-ink">
              Defer Outreach for {skipModalStudent.first_name} {skipModalStudent.last_name}
            </h3>
            <p className="text-xs text-muted">
              Select or enter the reason for deferring. This will be recorded in the IT audit log, and the student will carry forward to next week's digest.
            </p>

            <div className="space-y-2">
              {[
                'Already contacted via phone today',
                'Met with student during drop-in hours',
                'Awaiting department petition approval',
                'Student on temporary approved leave',
              ].map((reason) => (
                <label key={reason} className="flex items-center gap-2 text-xs text-ink cursor-pointer">
                  <input
                    type="radio"
                    name="skipReason"
                    checked={skipReason === reason}
                    onChange={() => setSkipReason(reason)}
                    className="text-coral focus:ring-coral"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSkipModalStudent(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-line hover:bg-surface-2 text-ink"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSkip}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-ink text-white hover:bg-black"
              >
                Confirm Deferral
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
