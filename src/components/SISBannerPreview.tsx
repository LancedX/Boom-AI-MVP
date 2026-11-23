import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Server,
  FileCode,
  Info,
} from 'lucide-react';

export const SISBannerPreview: React.FC = () => {
  const { students, counts } = useApp();

  const sampleBannerRows = students.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Banner Integration Header */}
      <div className="bg-surface-1 border border-line rounded-3xl p-6 shadow-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-coral" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Ellucian Banner 9 SIS Connector
            </span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-ok-tint text-ok flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-ok animate-pulse" />
            Read-Only Sync: Nightly 2:00 AM
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
            Banner Student Information System Integration Preview
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-3xl mt-1 leading-relaxed">
            Boom AI connects directly to Foothill College’s Ellucian Banner database in a 100% non-invasive, read-only mode. Every night at 2:00 AM, Boom ingests course enrollments, cumulative GPAs, and hold codes. Boom never modifies Banner tables directly.
          </p>
        </div>

        {/* Sync Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-line text-xs">
          <div className="p-3 bg-surface-2 rounded-xl border border-line">
            <span className="text-muted">Connector Status</span>
            <div className="font-bold text-ok mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-ok" />
              Connected (Read-Only)
            </div>
          </div>

          <div className="p-3 bg-surface-2 rounded-xl border border-line">
            <span className="text-muted">Data Freshness</span>
            <div className="font-bold text-ink mt-0.5">Today at 02:00 AM PST</div>
          </div>

          <div className="p-3 bg-surface-2 rounded-xl border border-line">
            <span className="text-muted">Records Ingested</span>
            <div className="font-bold text-ink mt-0.5">{counts.total} Active Students</div>
          </div>

          <div className="p-3 bg-surface-2 rounded-xl border border-line">
            <span className="text-muted">Write-Back Policy</span>
            <div className="font-bold text-coral-ink mt-0.5">Strict Zero Direct Writes</div>
          </div>
        </div>
      </div>

      {/* Banner Table Schema Mapping Preview */}
      <div className="bg-surface-1 border border-line rounded-3xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-line flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-ink">Banner SIS Table Snapshot (SFAREGS / SOAHOLD)</h2>
            <p className="text-xs text-muted">Direct view of fields ingested from Foothill's Banner student schema</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-surface-2 border border-line text-muted">
            Schema: BANNER_PROD_RO
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-2 border-b border-line text-muted font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Banner PIDM / ID</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Term Standing</th>
                <th className="py-3 px-4">Enrolled Units</th>
                <th className="py-3 px-4">Spring '27 Status</th>
                <th className="py-3 px-4">Hold Code</th>
                <th className="py-3 px-4">Financial Status</th>
                <th className="py-3 px-4">Assigned Advisor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {sampleBannerRows.map((s) => {
                const hasHold = s.registration_hold === 'Y' || (s.aid_hold_type && s.aid_hold_type !== 'None');

                return (
                  <tr key={s.student_id} className="hover:bg-surface-2/60 transition-colors font-mono">
                    <td className="py-3 px-4 font-bold text-ink">
                      {s.student_id}
                    </td>

                    <td className="py-3 px-4 font-sans font-medium text-ink">
                      {s.first_name} {s.last_name}
                    </td>

                    <td className="py-3 px-4 font-sans">
                      <span className="text-muted">{s.enrollment_status}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={s.units_enrolled < 12 ? 'text-coral-ink font-bold' : 'text-ink'}>
                        {s.units_enrolled}.00
                      </span>
                    </td>

                    <td className="py-3 px-4 font-sans">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          s.registered_for_spring === 'Y'
                            ? 'bg-ok-tint text-ok'
                            : 'bg-coral-tint text-coral-ink'
                        }`}
                      >
                        {s.registered_for_spring === 'Y' ? 'REGISTERED' : 'UNREGISTERED'}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-sans">
                      {hasHold ? (
                        <span className="text-warn font-semibold">
                          {s.aid_hold_type && s.aid_hold_type !== 'None' ? s.aid_hold_type : 'ACADEMIC_NOTICE'}
                        </span>
                      ) : (
                        <span className="text-faint">NONE</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-sans text-muted">
                      {s.financial_aid_status}
                    </td>

                    <td className="py-3 px-4 font-sans text-muted">
                      {s.assigned_advisor}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration Technical Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <Server className="w-4 h-4 text-coral" />
            Integration Architecture & Security
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            Boom AI queries a secure database replica or SFTP batch export provided by Foothill IT.
            Authentication is verified via TLS 1.3 certificates and IP whitelisting.
          </p>
          <div className="space-y-1.5 text-xs text-muted pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-ok" />
              <span>No modifications to Ellucian Banner schema or PL/SQL triggers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-ok" />
              <span>Automated night-run executes off-peak at 2:00 AM to eliminate database load</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-ok" />
              <span>Full compliance with FERPA data retention guidelines</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <FileCode className="w-4 h-4 text-muted" />
            Field Mapping Schema
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            Banner tables <code className="bg-surface-2 px-1 py-0.5 rounded text-ink">SZASTDN</code>,{' '}
            <code className="bg-surface-2 px-1 py-0.5 rounded text-ink">SFAREGS</code>, and{' '}
            <code className="bg-surface-2 px-1 py-0.5 rounded text-ink">SOAHOLD</code> map seamlessly to Boom AI’s
            student data model.
          </p>
          <div className="p-3 bg-surface-2 rounded-xl border border-line text-[11px] font-mono text-muted space-y-1">
            <div>BANNER.SOAHOLD_HLDD_CODE → Student.registration_hold</div>
            <div>BANNER.SFAREGS_CRN_COUNT → Student.units_enrolled</div>
            <div>BANNER.SHRTTRM_GPA → Student.cumulative_gpa</div>
            <div>BANNER.SGRSPRT_ADVR_PIDM → Student.assigned_advisor</div>
          </div>
        </div>
      </div>
    </div>
  );
};
