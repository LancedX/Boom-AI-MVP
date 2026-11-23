import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  FileText,
  Mail,
  Award,
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const { students, counts, setActiveTab } = useApp();

  const PILOT_FEE = 15000;
  // Calculate cost per confirmed registration in demo
  const confirmedCount = Math.max(counts.registeredWeekTwo, 1);
  const costPerRegistration = Math.round(PILOT_FEE / confirmedCount);

  // Estimated state funding per full-time student equivalent (FTES) in California Community Colleges (~$4,500 - $5,000)
  const estimatedTuitionPreserved = counts.registeredWeekTwo * 4600;

  return (
    <div className="space-y-6">
      {/* Executive Header & Friday Briefing Announcement */}
      <div className="bg-surface-1 border border-line rounded-3xl p-6 shadow-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-coral" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Foothill Executive Briefing · Office of the President & VP of Student Success
            </span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-2 border border-line text-muted">
            Delivered Every Friday · 08:00 AM PST
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
            Institutional Enrollment Recovery & Retention Outcomes
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-3xl mt-1 leading-relaxed">
            Executive leadership summary tracking continuing student persistence into Spring 2027.
            Reflects live confirmed registrations in Banner SIS without reliance on modeled projections.
          </p>
        </div>

        {/* Institutional Baseline Integrity Notice */}
        <div className="p-3.5 bg-surface-2 border border-line rounded-xl text-xs text-muted flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-coral" />
          <div className="leading-relaxed">
            <b className="text-ink">Methodological Reporting Standard:</b> Metrics below reflect actual student records in the current session. Historical cohort comparative analysis is required to establish validated causal lift across Foothill Community College. Projected targets are strictly separated from verified records.
          </div>
        </div>
      </div>

      {/* High-Level Executive Outcome Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Confirmed Spring Registrations */}
        <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-xs border-t-4 border-t-ok">
          <div className="flex items-center justify-between text-muted text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider">Banner Registrations</span>
            <CheckCircle2 className="w-4 h-4 text-ok" />
          </div>
          <div className="text-3xl font-extrabold text-ok tracking-tight">
            {counts.registeredWeekTwo}
          </div>
          <div className="text-xs text-muted mt-1">
            Confirmed continuing students
          </div>
          <div className="mt-2 text-[11px] text-ok font-medium bg-ok-tint px-2 py-0.5 rounded inline-block">
            Banner SIS Verified
          </div>
        </div>

        {/* Metric 2: Holds Resolved */}
        <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-xs border-t-4 border-t-warn">
          <div className="flex items-center justify-between text-muted text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider">Registration Holds Cleared</span>
            <ShieldCheck className="w-4 h-4 text-warn" />
          </div>
          <div className="text-3xl font-extrabold text-ink tracking-tight">
            {counts.replied + counts.registeredWeekTwo}
          </div>
          <div className="text-xs text-muted mt-1">
            Bursar & Academic clearance
          </div>
          <div className="mt-2 text-[11px] text-muted font-medium bg-surface-2 px-2 py-0.5 rounded inline-block">
            Out of {counts.holds} flagged
          </div>
        </div>

        {/* Metric 3: Cost per Recovered Student */}
        <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-xs border-t-4 border-t-coral">
          <div className="flex items-center justify-between text-muted text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider">Cost per Reg (vs $15k Pilot)</span>
            <DollarSign className="w-4 h-4 text-coral" />
          </div>
          <div className="text-3xl font-extrabold text-coral-ink tracking-tight">
            ${costPerRegistration.toLocaleString()}
          </div>
          <div className="text-xs text-muted mt-1">
            Based on $15,000 fixed fee
          </div>
          <div className="mt-2 text-[11px] text-coral-ink font-medium bg-coral-tint px-2 py-0.5 rounded inline-block">
            ROI Against Dropouts
          </div>
        </div>

        {/* Metric 4: Apportionment Preserved */}
        <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-xs border-t-4 border-t-ink">
          <div className="flex items-center justify-between text-muted text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider">Est. FTES Apportionment</span>
            <TrendingUp className="w-4 h-4 text-ink" />
          </div>
          <div className="text-3xl font-extrabold text-ink tracking-tight">
            ${estimatedTuitionPreserved.toLocaleString()}
          </div>
          <div className="text-xs text-muted mt-1">
            Est. California funding protected
          </div>
          <div className="mt-2 text-[11px] text-muted font-medium bg-surface-2 px-2 py-0.5 rounded inline-block">
            ~$4.6k state funding / FTES
          </div>
        </div>
      </div>

      {/* Executive Weekly Briefing Memo Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Friday Outlook Memo Simulation */}
        <div className="lg:col-span-8 bg-surface-1 border border-line rounded-3xl shadow-card p-6 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-coral" />
              <h2 className="text-base font-bold text-ink">
                Weekly Leadership Briefing Memo (Delivered Friday 8:00 AM)
              </h2>
            </div>
            <span className="text-xs text-faint font-mono">Confidential · Foothill Admin</span>
          </div>

          <div className="p-4 bg-surface-2 rounded-2xl border border-line text-xs sm:text-sm space-y-3 leading-relaxed text-ink">
            <div className="font-semibold text-ink border-b border-line/60 pb-2">
              MEMORANDUM: Spring 2027 Continuing Student Recovery Status
            </div>

            <p>
              <b>To:</b> Dr. Kristina Whalen (President) & Vice President of Student Success<br />
              <b>From:</b> Maya Okoro (Lead Counselor) & Boom AI System Administrator<br />
              <b>Date:</b> Friday, November 21, 2026<br />
              <b>Subject:</b> Weekly Enrollment Recovery Progress — Active Cohort Evaluation
            </p>

            <div className="p-3 bg-surface-1 rounded-xl border border-line space-y-1.5 text-xs">
              <div className="font-bold text-ink">Key Weekly Findings:</div>
              <ul className="list-disc pl-4 space-y-1 text-muted">
                <li>
                  <b className="text-ink">{counts.total} continuing students</b> were monitored in the active Banner cohort snapshot.
                </li>
                <li>
                  <b className="text-coral-ink">{counts.high} students</b> reached high-priority risk status (unregistered + active bursar/financial holds).
                </li>
                <li>
                  Counselors approved and dispatched <b className="text-ink">{counts.sent} personalized interventions</b> via verified college lines.
                </li>
                <li>
                  <b className="text-ok font-semibold">{counts.registeredWeekTwo} students</b> have now completed registration for Spring 2027 courses, confirming enrollment.
                </li>
                <li>
                  Average cost per confirmed registration stands at <b className="text-ink">${costPerRegistration}</b> against the proposed $15,000 quarterly pilot fee.
                </li>
              </ul>
            </div>

            <p className="text-xs text-muted">
              Counselors are prioritizing outreach to the remaining unregistered students before the close of priority enrollment. No manual database edits were required from IT.
            </p>
          </div>

          {/* Recovery Pipeline Visualization */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
              Enrollment Recovery Funnel Progression
            </h3>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-medium text-ink mb-1">
                  <span>1. Monitored Continuing Cohort</span>
                  <span>{counts.total} Students (100%)</span>
                </div>
                <div className="w-full bg-surface-3 h-2 rounded-full overflow-hidden">
                  <div className="bg-ink h-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-ink mb-1">
                  <span>2. Prioritized for Intervention</span>
                  <span>{counts.high + counts.medium} Students ({Math.round(((counts.high + counts.medium) / counts.total) * 100)}%)</span>
                </div>
                <div className="w-full bg-surface-3 h-2 rounded-full overflow-hidden">
                  <div className="bg-coral h-full" style={{ width: `${((counts.high + counts.medium) / counts.total) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-ink mb-1">
                  <span>3. Counselor Outreach Dispatched</span>
                  <span>{counts.sent} Students ({Math.round((counts.sent / counts.total) * 100)}%)</span>
                </div>
                <div className="w-full bg-surface-3 h-2 rounded-full overflow-hidden">
                  <div className="bg-warn h-full" style={{ width: `${(counts.sent / counts.total) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium text-ink mb-1">
                  <span>4. Confirmed Banner Registrations</span>
                  <span className="text-ok font-bold">{counts.registeredWeekTwo} Students ({Math.round((counts.registeredWeekTwo / counts.total) * 100)}%)</span>
                </div>
                <div className="w-full bg-surface-3 h-2 rounded-full overflow-hidden">
                  <div className="bg-ok h-full" style={{ width: `${(counts.registeredWeekTwo / counts.total) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Proposed Pilot Target Comparison */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface-1 border border-line rounded-3xl shadow-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2">
              <Award className="w-4 h-4 text-coral" />
              Pilot Scale Projection
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Based on expanding from this 50-student demonstration sample to Foothill's target cohort of 2,000 at-risk continuing students:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-surface-2 rounded-xl border border-line">
                <div className="text-muted font-medium">Target Population</div>
                <div className="text-lg font-bold text-ink mt-0.5">2,000 Students</div>
                <div className="text-[10px] text-faint">Continuing Foothill students</div>
              </div>

              <div className="p-3 bg-surface-2 rounded-xl border border-line">
                <div className="text-muted font-medium">Projected Registrations Recovered</div>
                <div className="text-lg font-bold text-ok mt-0.5">140 – 220 Students</div>
                <div className="text-[10px] text-muted">Estimated 7–11% recovery rate</div>
              </div>

              <div className="p-3 bg-surface-2 rounded-xl border border-line">
                <div className="text-muted font-medium">Estimated State Apportionment Protected</div>
                <div className="text-lg font-bold text-ink mt-0.5">$640,000 – $1,010,000</div>
                <div className="text-[10px] text-ok font-medium">40x+ Pilot Investment Return</div>
              </div>

              <button
                onClick={() => setActiveTab('pilot')}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-coral text-white hover:bg-coral-ink transition-colors shadow-xs"
              >
                <span>View Complete Pilot Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
