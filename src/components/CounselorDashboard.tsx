import React from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Users,
  ShieldAlert,
  Send,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Calendar,
  ChevronRight,
  TrendingUp,
  FileCheck,
  PhoneCall,
} from 'lucide-react';

export const CounselorDashboard: React.FC = () => {
  const {
    students,
    filteredStudents,
    counts,
    currentCounselor,
    setActiveTab,
    openStudentProfile,
    setSelectedStudent,
    settings,
  } = useApp();

  // Top priority intervention cases (High risk students who are not registered for Spring or have holds)
  const priorityInterventions = [...filteredStudents]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 6);

  // Recent activity from student timelines
  const recentTimelineEvents = students
    .flatMap((s) =>
      s.timeline.map((t) => ({
        ...t,
        studentName: `${s.first_name} ${s.last_name}`,
        studentId: s.student_id,
        student: s,
      }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const highPct = Math.round((counts.high / counts.total) * 100) || 0;
  const medPct = Math.round((counts.medium / counts.total) * 100) || 0;
  const watchPct = Math.round((counts.watch / counts.total) * 100) || 0;

  return (
    <div className="space-y-6">
      {/* Top Banner: Counselor Caseload & Monday Digest Announcement */}
      <div className="bg-surface-1 border border-line rounded-2xl p-5 sm:p-6 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-ok animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Weekly Recovery Digest
              </span>
              <span className="text-xs text-faint">·</span>
              <span className="text-xs text-muted font-medium">
                {settings.sendDay}s {settings.sendTime}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
              Good morning, {currentCounselor.name.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
              Boom AI analyzed <span className="font-semibold text-ink">{counts.total} student records</span> across
              Foothill's Banner SIS. <span className="font-semibold text-coral-ink">{counts.high} students</span> meet
              high-priority risk criteria and need proactive outreach before Spring registration closes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('digest')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-coral text-white hover:bg-coral-ink transition-colors shadow-xs w-full sm:w-auto"
            >
              <span>Review Monday Digest</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium border border-line-dark bg-surface-1 hover:bg-surface-2 text-ink transition-colors w-full sm:w-auto"
            >
              <span>View Directory ({counts.total})</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Students */}
        <div className="bg-surface-1 border border-line rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-1.5">
            <span className="text-xs font-medium">Total Cohort</span>
            <Users className="w-4 h-4 text-faint" />
          </div>
          <div className="text-2xl font-bold text-ink">{counts.total}</div>
          <div className="text-[11px] text-muted mt-1">Active Banner records</div>
        </div>

        {/* High Risk */}
        <div className="bg-surface-1 border border-line rounded-xl p-4 shadow-xs border-l-4 border-l-coral">
          <div className="flex items-center justify-between text-coral-ink mb-1.5">
            <span className="text-xs font-medium">High Priority</span>
            <AlertTriangle className="w-4 h-4 text-coral" />
          </div>
          <div className="text-2xl font-bold text-coral-ink">{counts.high}</div>
          <div className="text-[11px] text-muted mt-1">Score ≥ 50 (urgent)</div>
        </div>

        {/* Registration Holds */}
        <div className="bg-surface-1 border border-line rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-1.5">
            <span className="text-xs font-medium">Active Holds</span>
            <ShieldAlert className="w-4 h-4 text-warn" />
          </div>
          <div className="text-2xl font-bold text-ink">{counts.holds}</div>
          <div className="text-[11px] text-muted mt-1">Bursar & Academic</div>
        </div>

        {/* Not Registered for Spring */}
        <div className="bg-surface-1 border border-line rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-1.5">
            <span className="text-xs font-medium">Unregistered</span>
            <Clock className="w-4 h-4 text-muted" />
          </div>
          <div className="text-2xl font-bold text-ink">{counts.notRegistered}</div>
          <div className="text-[11px] text-muted mt-1">0 spring units enrolled</div>
        </div>

        {/* Outreach Sent / Active */}
        <div className="bg-surface-1 border border-line rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-1.5">
            <span className="text-xs font-medium">Messages Sent</span>
            <Send className="w-4 h-4 text-ok" />
          </div>
          <div className="text-2xl font-bold text-ok">{counts.sent}</div>
          <div className="text-[11px] text-muted mt-1">Counselor approved</div>
        </div>

        {/* Confirmed Recoveries */}
        <div className="bg-surface-1 border border-line rounded-xl p-4 shadow-xs bg-ok-tint/30">
          <div className="flex items-center justify-between text-ok mb-1.5">
            <span className="text-xs font-medium">Recovered</span>
            <CheckCircle className="w-4 h-4 text-ok" />
          </div>
          <div className="text-2xl font-bold text-ok">{counts.registeredWeekTwo}</div>
          <div className="text-[11px] text-muted mt-1">Holds cleared / registered</div>
        </div>
      </div>

      {/* Main Content Layout: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Priority Intervention List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-1 border border-line rounded-2xl shadow-card overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-line flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-ink flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-coral" />
                  Priority Student Interventions
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Students ranked highest by deterministic risk rules requiring counselor attention
                </p>
              </div>
              <button
                onClick={() => setActiveTab('directory')}
                className="text-xs font-medium text-coral hover:text-coral-ink flex items-center gap-1"
              >
                <span>All {counts.total} students</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-line">
              {priorityInterventions.map((student) => {
                const isSent = student.outreachState === 'sent';
                const hasReplied = !!student.studentReply;

                return (
                  <div
                    key={student.student_id}
                    className="p-4 hover:bg-surface-2/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Avatar initials */}
                      <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center font-semibold text-xs text-ink flex-shrink-0 border border-line">
                        {student.first_name[0]}
                        {student.last_name[0]}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => openStudentProfile(student)}
                            className="font-semibold text-sm text-ink hover:text-coral transition-colors text-left truncate"
                          >
                            {student.first_name} {student.last_name}
                          </button>
                          <span className="text-xs text-faint font-mono">
                            {student.student_id}
                          </span>

                          {/* Risk Tier Badge */}
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              student.riskTier === 'High'
                                ? 'bg-coral-tint text-coral-ink border border-coral/30'
                                : student.riskTier === 'Medium'
                                ? 'bg-warn-tint text-warn border border-warn/30'
                                : 'bg-surface-2 text-muted border border-line'
                            }`}
                          >
                            Score: {student.riskScore}
                          </span>

                          {/* Outreach Status Pill */}
                          {hasReplied ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-ok-tint text-ok">
                              <MessageSquare className="w-3 h-3" />
                              Replied
                            </span>
                          ) : isSent ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-ok-tint text-ok">
                              <Send className="w-3 h-3" />
                              Outreach Sent
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-coral-tint text-coral-ink">
                              Needs Review
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted mt-1">
                          <span>{student.program_of_study}</span>
                          <span>·</span>
                          <span>{student.units_enrolled} units ({student.enrollment_status})</span>
                          <span>·</span>
                          <span className="text-coral-ink font-medium">
                            {student.primaryRiskFactor}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                      <button
                        onClick={() => openStudentProfile(student)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-ink hover:bg-surface-3 transition-colors border border-line"
                      >
                        Profile
                      </button>

                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setActiveTab('outreach');
                        }}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          isSent
                            ? 'bg-surface-2 text-ink hover:bg-surface-3 border border-line'
                            : 'bg-coral text-white hover:bg-coral-ink shadow-xs'
                        }`}
                      >
                        <Send className="w-3 h-3" />
                        <span>{isSent ? 'View SMS' : 'Draft Outreach'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enrollment Recovery Funnel Card */}
          <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-card">
            <h2 className="text-base font-semibold text-ink flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-ok" />
              Enrollment Recovery Funnel (Spring 2027)
            </h2>
            <p className="text-xs text-muted mb-4">
              Real-time progression of continuing students from risk detection to confirmed Banner registration
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-surface-2 p-3 rounded-xl border border-line">
                <div className="text-xs text-muted font-medium">1. Identified At-Risk</div>
                <div className="text-xl font-bold text-ink mt-1">{counts.high + counts.medium}</div>
                <div className="text-[10px] text-faint">Rules-based flags</div>
              </div>

              <div className="bg-surface-2 p-3 rounded-xl border border-line">
                <div className="text-xs text-muted font-medium">2. Outreach Approved</div>
                <div className="text-xl font-bold text-coral-ink mt-1">{counts.sent}</div>
                <div className="text-[10px] text-faint">Verified counselor SMS/Email</div>
              </div>

              <div className="bg-surface-2 p-3 rounded-xl border border-line">
                <div className="text-xs text-muted font-medium">3. Students Responded</div>
                <div className="text-xl font-bold text-warn mt-1">{counts.replied}</div>
                <div className="text-[10px] text-faint">Forms / advisor requests</div>
              </div>

              <div className="bg-ok-tint/40 p-3 rounded-xl border border-ok/20">
                <div className="text-xs text-ok font-semibold">4. Spring Registered</div>
                <div className="text-xl font-bold text-ok mt-1">{counts.registeredWeekTwo}</div>
                <div className="text-[10px] text-ok">Confirmed in Banner SIS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Risk Distribution & Recent Activity */}
        <div className="space-y-6">
          {/* Risk Scoring Breakdown Card */}
          <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-ink">Risk Distribution</h3>
              <button
                onClick={() => setActiveTab('rules')}
                className="text-xs text-coral hover:text-coral-ink font-medium"
              >
                Rules Engine →
              </button>
            </div>
            <p className="text-xs text-muted mb-4">
              Deterministic priority tiers for {currentCounselor.name}'s assigned students
            </p>

            {/* Visual stacked bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-surface-3 mb-3">
              <div style={{ width: `${highPct}%` }} className="bg-coral h-full" title={`High: ${counts.high}`} />
              <div style={{ width: `${medPct}%` }} className="bg-warn h-full" title={`Medium: ${counts.medium}`} />
              <div style={{ width: `${watchPct}%` }} className="bg-ok h-full" title={`Watch: ${counts.watch}`} />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-coral-tint/50 border border-coral/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-coral" />
                  <span className="font-medium text-coral-ink">High Priority (≥50 pts)</span>
                </div>
                <span className="font-bold text-coral-ink">{counts.high} ({highPct}%)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-warn-tint/50 border border-warn/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-warn" />
                  <span className="font-medium text-warn">Medium Priority (30–49 pts)</span>
                </div>
                <span className="font-bold text-warn">{counts.medium} ({medPct}%)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-ok-tint/50 border border-ok/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-ok" />
                  <span className="font-medium text-ok">Watchlist (&lt;30 pts)</span>
                </div>
                <span className="font-bold text-ok">{counts.watch} ({watchPct}%)</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Log Feed */}
          <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-ink">Recent System Activity</h3>
              <button
                onClick={() => setActiveTab('it')}
                className="text-xs text-muted hover:text-ink font-medium"
              >
                Audit Log →
              </button>
            </div>

            <div className="space-y-3">
              {recentTimelineEvents.length === 0 ? (
                <div className="text-xs text-muted py-4 text-center">No recent activity</div>
              ) : (
                recentTimelineEvents.map((event) => (
                  <div key={event.id} className="text-xs border-l-2 border-line pl-3 py-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ink">{event.title}</span>
                      <span className="text-[10px] text-faint">
                        {new Date(event.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-muted text-[11px] leading-relaxed">
                      {event.studentName ? (
                        <span className="font-medium text-ink">{event.studentName}: </span>
                      ) : null}
                      {event.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Institutional Integration Notice */}
          <div className="bg-surface-2 border border-line rounded-2xl p-4 text-xs text-muted space-y-2">
            <div className="flex items-center gap-2 font-semibold text-ink">
              <span className="w-2 h-2 rounded-full bg-ok" />
              <span>Banner SIS Connector: Healthy</span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted">
              Boom AI connects via read-only snapshot. Nightly synchronization pulls academic holds and spring registration status every morning at 2:00 AM.
            </p>
            <div className="pt-1 flex gap-2">
              <button
                onClick={() => setActiveTab('sis')}
                className="text-[11px] font-semibold text-coral hover:underline"
              >
                Banner Preview
              </button>
              <span className="text-faint">·</span>
              <button
                onClick={() => setActiveTab('canvas')}
                className="text-[11px] font-semibold text-coral hover:underline"
              >
                Canvas Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
