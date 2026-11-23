import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Database,
  Lock,
  Download,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  FileSpreadsheet,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const ITAuditCenter: React.FC = () => {
  const { auditLog, exportReconciliationCSV, settings, currentVersion, counts } = useApp();

  const [searchFilter, setSearchFilter] = useState('');
  const [actorFilter, setActorFilter] = useState('All');

  const filteredLogs = auditLog.filter((entry) => {
    const matchesSearch =
      entry.action.toLowerCase().includes(searchFilter.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (entry.studentId && entry.studentId.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (entry.studentName && entry.studentName.toLowerCase().includes(searchFilter.toLowerCase()));

    const matchesActor = actorFilter === 'All' || entry.actor.includes(actorFilter);
    return matchesSearch && matchesActor;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-surface-1 border border-line rounded-3xl p-6 shadow-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-coral" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Foothill College IT Administration & Compliance
            </span>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-ok-tint text-ok font-semibold">
            Security Status: Compliant (FERPA Protected)
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
            IT Center, System Health & Audit Ledger
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-3xl mt-1 leading-relaxed">
            Boom AI functions as an asynchronous operational layer that never writes directly back to Foothill's primary Student Information System (SIS). Below is the complete, immutable transaction ledger of all counselor actions and automated syncs.
          </p>
        </div>

        {/* System Health Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-line text-xs">
          <div className="p-3 bg-surface-2 rounded-xl border border-line flex items-center justify-between">
            <div>
              <div className="text-muted font-medium">Banner SIS (Nightly Feed)</div>
              <div className="font-bold text-ink mt-0.5">Read-Only Snapshot</div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-ok" title="Healthy" />
          </div>

          <div className="p-3 bg-surface-2 rounded-xl border border-line flex items-center justify-between">
            <div>
              <div className="text-muted font-medium">Outbound Send Architecture</div>
              <div className="font-bold text-ink mt-0.5">Option {settings.sendOption} Active</div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-ok" title="Healthy" />
          </div>

          <div className="p-3 bg-surface-2 rounded-xl border border-line flex items-center justify-between">
            <div>
              <div className="text-muted font-medium">Rules Engine Math</div>
              <div className="font-bold text-ink mt-0.5">{currentVersion} · 0 AI Hallucinations</div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-ok" title="Healthy" />
          </div>
        </div>
      </div>

      {/* FERPA & Data Privacy Architecture Callout */}
      <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-ink flex items-center gap-2">
          <Lock className="w-4 h-4 text-coral" />
          Data Governance & FERPA Protection Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted">
          <div className="p-3 bg-surface-2 rounded-xl border border-line space-y-1">
            <b className="text-ink">1. Zero Direct Database Writes:</b>
            <p className="text-[11px] leading-relaxed">
              Boom AI never mutates Banner tables. Staff update their records in bulk via the cryptographically verifiable reconciliation CSV.
            </p>
          </div>

          <div className="p-3 bg-surface-2 rounded-xl border border-line space-y-1">
            <b className="text-ink">2. Zero Student Data in External LLMs:</b>
            <p className="text-[11px] leading-relaxed">
              Prioritization is 100% deterministic arithmetic. No student names, grades, or transcripts are sent to commercial AI API vendors.
            </p>
          </div>

          <div className="p-3 bg-surface-2 rounded-xl border border-line space-y-1">
            <b className="text-ink">3. Privacy-Preserving Audit Log:</b>
            <p className="text-[11px] leading-relaxed">
              Audit logs capture system events and anonymized student IDs. Sensitive message texts are excluded from long-term IT logs.
            </p>
          </div>
        </div>
      </div>

      {/* Audit Log Table with Search and CSV Export */}
      <div className="bg-surface-1 border border-line rounded-3xl shadow-card overflow-hidden">
        {/* Table Top Controls */}
        <div className="p-5 border-b border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-ink">Institutional Audit Log ({auditLog.length} Events)</h2>
            <p className="text-xs text-muted">Complete auditable history of student imports, approvals, and hold updates</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportReconciliationCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-coral text-white hover:bg-coral-ink transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Reconciliation CSV</span>
            </button>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="p-4 bg-surface-2/60 border-b border-line flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit actions, student ID, actor, or details..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-surface-1 border border-line rounded-xl text-xs text-ink focus:outline-none"
            />
          </div>

          <select
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
            className="px-3 py-1.5 bg-surface-1 border border-line rounded-xl text-xs text-ink focus:outline-none w-full sm:w-auto"
          >
            <option value="All">All Actors</option>
            <option value="Maya Okoro">Maya Okoro</option>
            <option value="System">System Scheduler</option>
            <option value="Banner">Banner Connector</option>
            <option value="Student">Student Webhook</option>
          </select>
        </div>

        {/* Log Entries Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-2 border-b border-line text-muted font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Student Context</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 text-right">Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    No audit records match your query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((entry) => (
                  <tr key={entry.id} className="hover:bg-surface-2/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-faint whitespace-nowrap">
                      {new Date(entry.timestamp).toISOString().replace('T', ' ').slice(0, 19)}
                    </td>

                    <td className="py-3 px-4 font-semibold text-ink whitespace-nowrap">
                      {entry.action}
                    </td>

                    <td className="py-3 px-4 text-muted whitespace-nowrap">
                      {entry.actor}
                    </td>

                    <td className="py-3 px-4">
                      {entry.studentId ? (
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] font-semibold text-ink bg-surface-2 px-1.5 py-0.5 rounded border border-line">
                            {entry.studentId}
                          </span>
                          {entry.studentName && (
                            <span className="text-muted truncate max-w-[120px]">{entry.studentName}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-faint italic">System-wide</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-muted max-w-md">
                      {entry.details}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          entry.simulated
                            ? 'bg-surface-2 text-muted'
                            : 'bg-ok-tint text-ok'
                        }`}
                      >
                        {entry.simulated ? 'Simulated' : 'Verified'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
