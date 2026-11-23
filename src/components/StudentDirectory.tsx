import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Send,
  MessageSquare,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const StudentDirectory: React.FC = () => {
  const {
    students,
    openStudentProfile,
    setSelectedStudent,
    setActiveTab,
    exportReconciliationCSV,
    allCounselors,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'All' | 'High' | 'Medium' | 'Watch'>('All');
  const [springRegFilter, setSpringRegFilter] = useState<'All' | 'Y' | 'N'>('All');
  const [holdFilter, setHoldFilter] = useState<'All' | 'Holds' | 'NoHolds'>('All');
  const [advisorFilter, setAdvisorFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'gpa' | 'units' | 'missing'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Filter & Sort
  const processedStudents = useMemo(() => {
    let result = [...students];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.first_name.toLowerCase().includes(q) ||
          s.last_name.toLowerCase().includes(q) ||
          s.student_id.toLowerCase().includes(q) ||
          s.program_of_study.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }

    // Tier filter
    if (tierFilter !== 'All') {
      result = result.filter((s) => s.riskTier === tierFilter);
    }

    // Spring reg filter
    if (springRegFilter !== 'All') {
      result = result.filter((s) => s.registered_for_spring === springRegFilter);
    }

    // Hold filter
    if (holdFilter === 'Holds') {
      result = result.filter(
        (s) => s.registration_hold === 'Y' || (s.aid_hold_type && s.aid_hold_type !== 'None')
      );
    } else if (holdFilter === 'NoHolds') {
      result = result.filter(
        (s) => s.registration_hold === 'N' && (!s.aid_hold_type || s.aid_hold_type === 'None')
      );
    }

    // Advisor filter
    if (advisorFilter !== 'All') {
      result = result.filter((s) => s.assigned_advisor === advisorFilter);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'score':
          comparison = a.riskScore - b.riskScore;
          break;
        case 'name':
          comparison = `${a.last_name} ${a.first_name}`.localeCompare(`${b.last_name} ${b.first_name}`);
          break;
        case 'gpa':
          comparison = a.cumulative_gpa - b.cumulative_gpa;
          break;
        case 'units':
          comparison = a.units_enrolled - b.units_enrolled;
          break;
        case 'missing':
          comparison = a.missing_assignments - b.missing_assignments;
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [students, searchQuery, tierFilter, springRegFilter, holdFilter, advisorFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(processedStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedStudents.slice(start, start + pageSize);
  }, [processedStudents, currentPage]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-5">
      {/* Directory Title & Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-1 border border-line p-5 rounded-2xl shadow-card">
        <div>
          <h1 className="text-xl font-bold text-ink flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-coral" />
            Foothill Student Cohort Directory
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            Verified records from Foothill Banner SIS nightly synchronization. Showing{' '}
            <span className="font-semibold text-ink">{processedStudents.length}</span> of {students.length} students.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={exportReconciliationCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-line-dark bg-surface-1 hover:bg-surface-2 text-ink transition-colors shadow-xs"
            title="Download reconciliation CSV report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filters Controls */}
      <div className="bg-surface-1 border border-line rounded-2xl p-4 shadow-xs space-y-3">
        {/* Search Input & Quick Stats */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, ID (e.g. S100101), program, or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-surface-2 border border-line rounded-xl text-xs sm:text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={advisorFilter}
              onChange={(e) => {
                setAdvisorFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-surface-2 border border-line rounded-xl text-xs font-medium text-ink focus:outline-none"
            >
              <option value="All">All Advisors</option>
              {allCounselors.map((c) => (
                <option key={c.id} value={c.id}>
                  Advisor: {c.name}
                </option>
              ))}
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [f, o] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                setSortBy(f);
                setSortOrder(o);
              }}
              className="px-3 py-2 bg-surface-2 border border-line rounded-xl text-xs font-medium text-ink focus:outline-none"
            >
              <option value="score-desc">Sort: Risk Score (High → Low)</option>
              <option value="score-asc">Sort: Risk Score (Low → High)</option>
              <option value="name-asc">Sort: Name (A → Z)</option>
              <option value="name-desc">Sort: Name (Z → A)</option>
              <option value="gpa-asc">Sort: GPA (Lowest First)</option>
              <option value="units-asc">Sort: Units (Fewest First)</option>
              <option value="missing-desc">Sort: Missing Assignments</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line text-xs">
          <span className="text-muted font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filters:
          </span>

          {/* Priority Tier Filter */}
          {(['All', 'High', 'Medium', 'Watch'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTierFilter(t);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                tierFilter === t
                  ? 'bg-ink text-white'
                  : 'bg-surface-2 hover:bg-surface-3 text-muted'
              }`}
            >
              {t === 'All' ? 'All Priorities' : `${t} Risk`}
            </button>
          ))}

          <span className="text-line-dark">|</span>

          {/* Spring Registration Filter */}
          <button
            onClick={() => {
              setSpringRegFilter(springRegFilter === 'N' ? 'All' : 'N');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              springRegFilter === 'N'
                ? 'bg-coral-ink text-white'
                : 'bg-surface-2 hover:bg-surface-3 text-muted'
            }`}
          >
            Not Registered for Spring
          </button>

          {/* Holds Filter */}
          <button
            onClick={() => {
              setHoldFilter(holdFilter === 'Holds' ? 'All' : 'Holds');
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              holdFilter === 'Holds'
                ? 'bg-warn text-white'
                : 'bg-surface-2 hover:bg-surface-3 text-muted'
            }`}
          >
            Has Active Holds
          </button>

          {(tierFilter !== 'All' || springRegFilter !== 'All' || holdFilter !== 'All' || advisorFilter !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setTierFilter('All');
                setSpringRegFilter('All');
                setHoldFilter('All');
                setAdvisorFilter('All');
                setCurrentPage(1);
              }}
              className="text-xs text-coral hover:underline ml-auto font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Student List View: Table for Desktop & Cards for Mobile */}
      <div className="bg-surface-1 border border-line rounded-2xl shadow-card overflow-hidden">
        {/* Desktop Table View (hidden on small screens) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-2/80 border-b border-line text-muted font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Program & Goal</th>
                <th className="py-3 px-4">Academic & Load</th>
                <th className="py-3 px-4">LMS Telemetry</th>
                <th className="py-3 px-4">Spring '27 Status</th>
                <th className="py-3 px-4">Registration Hold</th>
                <th className="py-3 px-4">Advisor</th>
                <th className="py-3 px-4 cursor-pointer hover:text-ink" onClick={() => handleSort('score')}>
                  <div className="flex items-center gap-1">
                    <span>Priority Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted">
                    No students match the current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => {
                  const hasHold = student.registration_hold === 'Y' || (student.aid_hold_type && student.aid_hold_type !== 'None');
                  const isRegistered = student.registered_for_spring === 'Y';

                  return (
                    <tr
                      key={student.student_id}
                      onClick={() => openStudentProfile(student)}
                      className="hover:bg-surface-2/70 transition-colors cursor-pointer group"
                    >
                      {/* Name & ID */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-ink group-hover:text-coral transition-colors">
                          {student.first_name} {student.last_name}
                        </div>
                        <div className="text-[11px] text-faint font-mono">{student.student_id}</div>
                      </td>

                      {/* Program & Goal */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-ink truncate max-w-[150px]">
                          {student.program_of_study}
                        </div>
                        <div className="text-[11px] text-muted truncate max-w-[150px]">
                          {student.stated_goal}
                        </div>
                      </td>

                      {/* Academic & Load */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-ink">
                          GPA: <span className={student.cumulative_gpa < 2.0 ? 'text-coral-ink font-bold' : ''}>{student.cumulative_gpa.toFixed(2)}</span>
                          <span className="text-muted ml-1">({student.lowest_current_grade})</span>
                        </div>
                        <div className="text-[11px] text-muted">
                          {student.units_enrolled} units · {student.modality}
                        </div>
                      </td>

                      {/* LMS Telemetry */}
                      <td className="py-3 px-4">
                        <div className="text-ink">
                          {student.lms_logins_last_14_days !== null ? (
                            <span>{student.lms_logins_last_14_days} logins / 14d</span>
                          ) : (
                            <span className="text-faint italic">Unknown</span>
                          )}
                        </div>
                        <div className="text-[11px]">
                          {student.missing_assignments > 0 ? (
                            <span className="text-coral-ink font-medium">
                              {student.missing_assignments} missing tasks
                            </span>
                          ) : (
                            <span className="text-ok">0 missing</span>
                          )}
                        </div>
                      </td>

                      {/* Spring 2027 Status */}
                      <td className="py-3 px-4">
                        {isRegistered ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-ok-tint text-ok">
                            <CheckCircle2 className="w-3 h-3" />
                            Registered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-coral-tint text-coral-ink">
                            <Clock className="w-3 h-3" />
                            Unregistered
                          </span>
                        )}
                      </td>

                      {/* Registration Hold */}
                      <td className="py-3 px-4">
                        {hasHold ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-warn-tint text-warn">
                              <ShieldAlert className="w-3 h-3" />
                              {student.aid_hold_type && student.aid_hold_type !== 'None'
                                ? student.aid_hold_type
                                : 'Academic Notice'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-faint text-[11px]">Clean / No hold</span>
                        )}
                      </td>

                      {/* Advisor */}
                      <td className="py-3 px-4 text-muted font-medium">
                        {student.assigned_advisor}
                      </td>

                      {/* Priority Score */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs ${
                              student.riskTier === 'High'
                                ? 'bg-coral-tint text-coral-ink border border-coral/30'
                                : student.riskTier === 'Medium'
                                ? 'bg-warn-tint text-warn border border-warn/30'
                                : 'bg-surface-3 text-muted'
                            }`}
                          >
                            {student.riskScore}
                          </span>
                          <div>
                            <div className="font-semibold text-ink text-[11px]">{student.riskTier}</div>
                            <div className="text-[10px] text-muted truncate max-w-[120px]">
                              {student.primaryRiskFactor}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setActiveTab('outreach');
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-surface-2 hover:bg-surface-3 text-ink border border-line transition-colors"
                        >
                          Outreach
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile / Tablet Responsive Card View (visible below lg) */}
        <div className="lg:hidden divide-y divide-line">
          {paginatedStudents.length === 0 ? (
            <div className="py-8 text-center text-muted text-xs">
              No students match the current filter criteria.
            </div>
          ) : (
            paginatedStudents.map((student) => {
              const hasHold = student.registration_hold === 'Y' || (student.aid_hold_type && student.aid_hold_type !== 'None');
              const isRegistered = student.registered_for_spring === 'Y';

              return (
                <div
                  key={student.student_id}
                  onClick={() => openStudentProfile(student)}
                  className="p-4 hover:bg-surface-2/60 transition-colors cursor-pointer space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-sm text-ink flex items-center gap-2">
                        <span>{student.first_name} {student.last_name}</span>
                        <span className="text-xs text-faint font-mono">({student.student_id})</span>
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        {student.program_of_study} · {student.units_enrolled} units
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                        student.riskTier === 'High'
                          ? 'bg-coral-tint text-coral-ink'
                          : student.riskTier === 'Medium'
                          ? 'bg-warn-tint text-warn'
                          : 'bg-surface-3 text-muted'
                      }`}
                    >
                      {student.riskScore} pts
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Spring Reg status */}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                        isRegistered ? 'bg-ok-tint text-ok' : 'bg-coral-tint text-coral-ink'
                      }`}
                    >
                      {isRegistered ? 'Spring Registered' : 'Not Registered'}
                    </span>

                    {/* Hold badge */}
                    {hasHold && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-warn-tint text-warn">
                        <ShieldAlert className="w-3 h-3" />
                        {student.aid_hold_type && student.aid_hold_type !== 'None'
                          ? student.aid_hold_type
                          : 'Hold'}
                      </span>
                    )}

                    <span className="text-muted text-[11px]">
                      GPA: {student.cumulative_gpa.toFixed(2)}
                    </span>
                  </div>

                  <div className="text-xs text-coral-ink font-medium">
                    ⚠️ {student.primaryRiskFactor}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-line/60">
                    <span className="text-xs text-muted font-medium">
                      Advisor: {student.assigned_advisor}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openStudentProfile(student);
                      }}
                      className="text-xs font-semibold text-coral hover:underline flex items-center gap-1"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted bg-surface-1">
          <div>
            Showing <span className="font-semibold text-ink">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-ink">
              {Math.min(currentPage * pageSize, processedStudents.length)}
            </span>{' '}
            of <span className="font-semibold text-ink">{processedStudents.length}</span> students
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 rounded-lg border border-line bg-surface-2 hover:bg-surface-3 text-ink disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="px-2 font-medium text-ink">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-line bg-surface-2 hover:bg-surface-3 text-ink disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
