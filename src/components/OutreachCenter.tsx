import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import {
  Smartphone,
  Mail,
  GraduationCap,
  Send,
  CheckCircle,
  Clock,
  RotateCcw,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  User,
  ShieldAlert,
  ChevronRight,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export const OutreachCenter: React.FC = () => {
  const {
    filteredStudents,
    selectedStudent,
    setSelectedStudent,
    currentCounselor,
    approveOutreach,
    skipOutreach,
    simulateStudentReply,
    markStudentRegistered,
  } = useApp();

  // Active student selection: either current selectedStudent or first high risk student
  const activeStudent: Student =
    selectedStudent ||
    filteredStudents.find((s) => s.riskTier === 'High') ||
    filteredStudents[0];

  const [selectedChannel, setSelectedChannel] = useState<'SMS' | 'Email' | 'Canvas'>('SMS');
  const [editedDraft, setEditedDraft] = useState<string>(
    activeStudent ? activeStudent.customDraft || activeStudent.suggestedDraft : ''
  );
  const [customReplyInput, setCustomReplyInput] = useState('');

  // When activeStudent changes, update draft text
  React.useEffect(() => {
    if (activeStudent) {
      setEditedDraft(activeStudent.customDraft || activeStudent.suggestedDraft);
    }
  }, [activeStudent?.student_id]);

  if (!activeStudent) {
    return (
      <div className="p-12 text-center text-muted">
        No students available in the current caseload.
      </div>
    );
  }

  const isApproved = activeStudent.outreachState === 'sent';
  const hasReply = !!activeStudent.studentReply;

  const handleApprove = () => {
    approveOutreach(activeStudent.student_id, selectedChannel, editedDraft);
  };

  const handleReplyShortcut = (replyText: string, markRegistered: boolean = false) => {
    simulateStudentReply(activeStudent.student_id, replyText, markRegistered);
  };

  const handleSendCustomReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (customReplyInput.trim()) {
      simulateStudentReply(activeStudent.student_id, customReplyInput.trim());
      setCustomReplyInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-ink flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-coral" />
            Outreach Approval Workbench & SMS Simulator
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            Counselor-in-the-loop review queue. Live smartphone delivery and bidirectional response simulation.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-surface-2 border border-line text-muted">
            Sender: <b className="text-ink">{currentCounselor.name}</b>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-ok-tint text-ok font-semibold">
            Foothill Verified Line
          </span>
        </div>
      </div>

      {/* Main Workbench Grid: Student Queue (Left), Message Workbench (Center), Smartphone Simulator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (3 cols): Student Selection Queue */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-surface-1 border border-line rounded-2xl shadow-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
                Student Outreach Queue
              </h2>
              <span className="text-xs text-faint">
                {filteredStudents.length} Students
              </span>
            </div>

            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredStudents.map((student) => {
                const isSelected = student.student_id === activeStudent.student_id;
                const isSent = student.outreachState === 'sent';
                const replied = !!student.studentReply;

                return (
                  <button
                    key={student.student_id}
                    onClick={() => {
                      setSelectedStudent(student);
                      setEditedDraft(student.customDraft || student.suggestedDraft);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-ink text-white border-ink shadow-sm'
                        : 'bg-surface-2/60 hover:bg-surface-2 border-line text-ink'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-xs truncate">
                          {student.first_name} {student.last_name}
                        </div>
                        <div className={`text-[11px] truncate ${isSelected ? 'text-white/70' : 'text-muted'}`}>
                          {student.program_of_study}
                        </div>
                      </div>

                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : student.riskTier === 'High'
                            ? 'bg-coral-tint text-coral-ink'
                            : 'bg-surface-3 text-muted'
                        }`}
                      >
                        {student.riskScore}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className={`truncate max-w-[130px] ${isSelected ? 'text-white/80' : 'text-coral-ink font-medium'}`}>
                        {student.primaryRiskFactor}
                      </span>

                      {replied ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-ok bg-ok-tint px-1.5 py-0.2 rounded">
                          <MessageSquare className="w-2.5 h-2.5" />
                          Replied
                        </span>
                      ) : isSent ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-ok bg-ok-tint px-1.5 py-0.2 rounded">
                          <CheckCircle className="w-2.5 h-2.5" />
                          Sent
                        </span>
                      ) : (
                        <span className={`text-[10px] ${isSelected ? 'text-coral-tint' : 'text-faint'}`}>
                          Draft
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Column (5 cols): Draft Editor & Counselor Approval */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface-1 border border-line rounded-2xl shadow-card p-5 space-y-4">
            {/* Student Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-line">
              <div>
                <h2 className="text-lg font-bold text-ink">
                  {activeStudent.first_name} {activeStudent.last_name}
                </h2>
                <div className="text-xs text-muted flex items-center gap-2 mt-0.5">
                  <span className="font-mono">ID: {activeStudent.student_id}</span>
                  <span>·</span>
                  <span>{activeStudent.phone || 'No phone'}</span>
                  <span>·</span>
                  <span>{activeStudent.email}</span>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  activeStudent.riskTier === 'High'
                    ? 'bg-coral-tint text-coral-ink'
                    : 'bg-warn-tint text-warn'
                }`}
              >
                {activeStudent.riskTier} Risk ({activeStudent.riskScore} pts)
              </span>
            </div>

            {/* Why Flagged Box */}
            <div className="p-3 bg-surface-2 rounded-xl border border-line text-xs space-y-1">
              <div className="font-semibold text-ink flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-coral" />
                <span>Detection Reason: {activeStudent.primaryRiskFactor}</span>
              </div>
              <p className="text-muted text-[11px] leading-relaxed">
                {activeStudent.recommendedNextAction}
              </p>
            </div>

            {/* Channel Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">
                Outreach Delivery Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedChannel('SMS')}
                  className={`p-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                    selectedChannel === 'SMS'
                      ? 'bg-ink text-white border-ink'
                      : 'bg-surface-2 border-line text-muted hover:text-ink'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>SMS Text</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedChannel('Email')}
                  className={`p-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                    selectedChannel === 'Email'
                      ? 'bg-ink text-white border-ink'
                      : 'bg-surface-2 border-line text-muted hover:text-ink'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedChannel('Canvas')}
                  className={`p-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                    selectedChannel === 'Canvas'
                      ? 'bg-ink text-white border-ink'
                      : 'bg-surface-2 border-line text-muted hover:text-ink'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Canvas Inbox</span>
                </button>
              </div>
            </div>

            {/* Message Draft Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Counselor Message Draft
                </label>
                <span className="text-[11px] text-ok font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-ok" />
                  8th Grade Verified
                </span>
              </div>

              <textarea
                rows={5}
                value={editedDraft}
                onChange={(e) => setEditedDraft(e.target.value)}
                className="w-full p-3 bg-surface-2 border border-line rounded-xl text-xs sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral leading-relaxed"
                placeholder="Type your message here..."
              />

              <div className="flex items-center justify-between text-[11px] text-muted">
                <span>Characters: {editedDraft.length}</span>
                <span>Est. Segments: {Math.ceil(editedDraft.length / 160) || 1} SMS</span>
              </div>
            </div>

            {/* Approval / Dispatch Controls */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={handleApprove}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-coral text-white hover:bg-coral-ink transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>{isApproved ? 'Update & Resend Message' : 'Approve & Send Outreach'}</span>
              </button>

              <button
                type="button"
                onClick={() => skipOutreach(activeStudent.student_id, 'Deferred by counselor review')}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl text-xs font-medium border border-line bg-surface-1 hover:bg-surface-2 text-muted hover:text-ink transition-colors"
              >
                Defer
              </button>
            </div>

            {/* Delivery State Info */}
            <div className="p-3 bg-surface-2/60 rounded-xl border border-line text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted">Current Delivery Status:</span>
                <span className={`font-semibold ${isApproved ? 'text-ok' : 'text-coral-ink'}`}>
                  {isApproved ? 'Delivered to Student Phone' : 'Draft Awaiting Approval'}
                </span>
              </div>
              {activeStudent.approvedAt && (
                <div className="text-[11px] text-faint">
                  Approved at: {new Date(activeStudent.approvedAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (3 cols): On-Screen Smartphone SMS Simulator */}
        <div className="lg:col-span-3 flex flex-col items-center">
          {/* Smartphone Frame */}
          <div className="w-full max-w-[320px] bg-ink rounded-[40px] p-3 shadow-big border-4 border-surface-3 relative flex flex-col">
            {/* Phone Screen */}
            <div className="bg-surface-1 rounded-[30px] overflow-hidden flex flex-col h-[520px] border border-line">
              {/* Phone Top Notch & Status */}
              <div className="bg-surface-2 pt-2 px-4 pb-2 border-b border-line flex items-center justify-between text-[10px] text-muted font-medium">
                <span>9:41</span>
                <div className="w-16 h-3 bg-ink/10 rounded-full" />
                <span>5G · 100%</span>
              </div>

              {/* Chat Header */}
              <div className="p-3 bg-surface-2 border-b border-line text-center">
                <div className="w-8 h-8 rounded-full bg-coral-tint text-coral-ink font-bold text-xs flex items-center justify-center mx-auto mb-1">
                  FH
                </div>
                <div className="font-semibold text-xs text-ink leading-tight">
                  Foothill Counseling
                </div>
                <div className="text-[10px] text-muted">
                  (555) 014-4820 · Verified Line
                </div>
              </div>

              {/* Chat Thread Messages */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-surface-1 text-xs">
                {/* Counselor Sent Bubble */}
                {isApproved ? (
                  <div className="flex flex-col items-end space-y-0.5">
                    <div className="max-w-[85%] bg-coral text-white p-2.5 rounded-2xl rounded-br-xs text-xs leading-relaxed shadow-xs">
                      {activeStudent.customDraft || activeStudent.suggestedDraft}
                    </div>
                    <span className="text-[9px] text-faint">
                      Delivered · {activeStudent.approvedAt ? new Date(activeStudent.approvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '9:42 AM'}
                    </span>
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted text-xs space-y-2">
                    <Clock className="w-6 h-6 text-faint mx-auto" />
                    <p className="text-[11px]">
                      No message sent yet. Click <b className="text-ink">Approve & Send</b> to dispatch.
                    </p>
                  </div>
                )}

                {/* Inbound Student Reply Bubble */}
                {hasReply && (
                  <div className="flex flex-col items-start space-y-0.5 animate-fadeIn">
                    <div className="max-w-[85%] bg-surface-2 text-ink p-2.5 rounded-2xl rounded-bl-xs text-xs leading-relaxed border border-line">
                      {activeStudent.studentReply}
                    </div>
                    <span className="text-[9px] text-faint">
                      Student Reply · {activeStudent.replyTimestamp ? new Date(activeStudent.replyTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '9:45 AM'}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Reply Simulation Buttons */}
              <div className="p-2 bg-surface-2 border-t border-line space-y-1.5">
                <div className="text-[10px] font-semibold text-muted uppercase text-center">
                  Simulate Student Reply:
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleReplyShortcut('Sent Form — I uploaded my verification docs.')}
                    className="w-full py-1.5 px-2 bg-surface-1 hover:bg-ok-tint text-ink hover:text-ok text-[11px] font-medium rounded-lg border border-line transition-colors text-left truncate flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3 text-ok flex-shrink-0" />
                      "Sent Form"
                    </span>
                    <span className="text-[9px] text-muted">Resolves hold</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReplyShortcut('Need Advisor — Can we meet tomorrow?')}
                    className="w-full py-1.5 px-2 bg-surface-1 hover:bg-coral-tint text-ink hover:text-coral-ink text-[11px] font-medium rounded-lg border border-line transition-colors text-left truncate flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-coral-ink flex-shrink-0" />
                      "Need Advisor"
                    </span>
                    <span className="text-[9px] text-muted">Books 1-on-1</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReplyShortcut('Got it, registered! — Just enrolled in 14 units.', true)}
                    className="w-full py-1.5 px-2 bg-surface-1 hover:bg-ok-tint text-ink hover:text-ok text-[11px] font-medium rounded-lg border border-line transition-colors text-left truncate flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="w-3 h-3 text-ok flex-shrink-0" />
                      "Just registered!"
                    </span>
                    <span className="text-[9px] text-ok font-semibold">Spring Confirmed</span>
                  </button>
                </div>

                {/* Custom Freeform Reply Form */}
                <form onSubmit={handleSendCustomReply} className="pt-1 flex gap-1">
                  <input
                    type="text"
                    placeholder="Custom reply..."
                    value={customReplyInput}
                    onChange={(e) => setCustomReplyInput(e.target.value)}
                    className="flex-1 py-1 px-2 text-[10px] bg-surface-1 border border-line rounded-md text-ink focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-2 py-1 bg-ink text-white text-[10px] rounded-md font-semibold"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
