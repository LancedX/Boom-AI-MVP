import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  CheckCircle2,
  Calendar,
  DollarSign,
  Users,
  Shield,
  Target,
  ArrowRight,
  Sparkles,
  ClipboardCheck,
  Check,
} from 'lucide-react';

export const PilotProposal: React.FC = () => {
  const { counts, settings } = useApp();

  // Interactive Pilot Readiness Checklist State
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    'c1': true,  // Read-only Banner snapshot schedule approved
    'c2': true,  // FERPA data handling review completed
    'c3': true,  // Top 15 students per counselor weekly cap agreed
    'c4': true,  // 8th-grade reading level messaging templates approved
    'c5': false, // Counselor drop-in training session (30 minutes)
    'c6': true,  // Verified college SMS shortcode configured
    'c7': false, // Weekly Friday executive briefing list confirmed
    'c8': false, // Historical Fall-to-Winter baseline comparison defined
    'c9': true,  // $15,000 fixed fee milestone schedule drafted
    'c10': false, // End-of-quarter pilot retrospective date set
  });

  const toggleCheck = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Title & Commercial Agreement Header */}
      <div className="bg-surface-1 border border-line rounded-3xl p-6 shadow-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-coral" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Foothill Community College · Partnership Proposal
            </span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-coral-tint text-coral-ink">
            Proposed Commercial Term: Spring 2027 Quarter
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
            Spring 2027 Enrollment Recovery Pilot Proposal
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-3xl mt-1 leading-relaxed">
            A focused, one-quarter design partnership designed for Foothill Community College. Sits as an intelligent operational layer alongside Banner SIS to recover at-risk continuing students before the drop deadline.
          </p>
        </div>

        {/* Commercial Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-line text-xs">
          <div className="p-3 bg-surface-2 rounded-xl border border-line">
            <span className="text-muted">Investment Structure</span>
            <div className="text-base font-bold text-ink mt-0.5">$15,000 Fixed Fee</div>
            <div className="text-[10px] text-faint">One academic quarter</div>
          </div>

          <div className="p-3 bg-surface-2 rounded-xl border border-line">
            <span className="text-muted">Target Student Population</span>
            <div className="text-base font-bold text-ink mt-0.5">2,000 Continuing Students</div>
            <div className="text-[10px] text-faint">At-risk of non-enrollment</div>
          </div>

          <div className="p-3 bg-surface-2 rounded-xl border border-line">
            <span className="text-muted">Implementation Cadence</span>
            <div className="text-base font-bold text-ink mt-0.5">10-Week Academic Run</div>
            <div className="text-[10px] text-faint">Spring 2027 term</div>
          </div>

          <div className="p-3 bg-surface-2 rounded-xl border border-line">
            <span className="text-muted">Contract Conversion</span>
            <div className="text-base font-bold text-ok mt-0.5">Annual Subscription Option</div>
            <div className="text-[10px] text-ok">Contingent on demonstrated ROI</div>
          </div>
        </div>
      </div>

      {/* Main Proposal Body: 4 Core Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pillar 1: Objectives & Target Population */}
        <div className="bg-surface-1 border border-line rounded-3xl shadow-card p-6 space-y-4">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <Target className="w-5 h-5 text-coral" />
            1. Pilot Objectives & Target Cohort
          </h2>

          <div className="space-y-3 text-xs text-muted leading-relaxed">
            <p>
              Community colleges across California face substantial stopout rates between quarters. The primary objective is to recover enrolled students who are in danger of dropping out due to bureaucratic obstacles:
            </p>

            <ul className="list-disc pl-4 space-y-1.5 text-ink">
              <li>
                <b>Clear Administrative & Bursar Holds:</b> Guide students through quick payment plans or emergency relief funds to lift holds stopping registration.
              </li>
              <li>
                <b>Resolve Financial Aid Verification:</b> Eliminate aid hold obstacles (verification docs, missing FAFSA/CADAA filings) before disenrollment.
              </li>
              <li>
                <b>Direct Course Registration:</b> Proactively nudge students into open Spring sections to protect full-time unit progression and transfer eligibility.
              </li>
              <li>
                <b>Measurable Counselor Efficiency:</b> Save counselors hours each week by automating student prioritization and personalized outreach drafting.
              </li>
            </ul>
          </div>
        </div>

        {/* Pillar 2: Roles & Institutional Responsibilities */}
        <div className="bg-surface-1 border border-line rounded-3xl shadow-card p-6 space-y-4">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <Users className="w-5 h-5 text-ok" />
            2. Stakeholder Responsibilities
          </h2>

          <div className="space-y-3 text-xs text-muted leading-relaxed">
            <div className="p-3 bg-surface-2 rounded-xl border border-line space-y-1">
              <b className="text-ink">Foothill College IT:</b>
              <p className="text-[11px]">
                Provide an automated read-only database replica or nightly SFTP CSV export from Banner at 2:00 AM. Zero custom development required.
              </p>
            </div>

            <div className="p-3 bg-surface-2 rounded-xl border border-line space-y-1">
              <b className="text-ink">Foothill Counseling Staff:</b>
              <p className="text-[11px]">
                Review the Monday 7:00 AM digest (Top 15 students). Maintain 100% human-in-the-loop approval before any message dispatches.
              </p>
            </div>

            <div className="p-3 bg-surface-2 rounded-xl border border-line space-y-1">
              <b className="text-ink">Boom AI Engineering Team:</b>
              <p className="text-[11px]">
                Maintain 99.9% uptime, manage secure SMS/Email dispatch rails, deliver Friday executive briefings, and support counselor questions.
              </p>
            </div>
          </div>
        </div>

        {/* Pillar 3: Success Metrics & Rigorous Evaluation */}
        <div className="bg-surface-1 border border-line rounded-3xl shadow-card p-6 space-y-4">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-coral" />
            3. Measurable Evaluation Criteria
          </h2>

          <div className="space-y-3 text-xs text-muted leading-relaxed">
            <p>
              To ensure objective evaluation, the pilot’s success will be measured against explicit benchmarks:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-surface-2 rounded-xl border border-line flex items-center justify-between">
                <div>
                  <div className="font-bold text-ink">Registration Holds Cleared</div>
                  <div className="text-[11px] text-muted">Number of students clearing bursar/aid holds within 7 days</div>
                </div>
                <span className="font-bold text-ink font-mono">≥ 60%</span>
              </div>

              <div className="p-3 bg-surface-2 rounded-xl border border-line flex items-center justify-between">
                <div>
                  <div className="font-bold text-ink">Confirmed Banner Registrations</div>
                  <div className="text-[11px] text-muted">Verified enrolled spring units compared to baseline cohort</div>
                </div>
                <span className="font-bold text-ok font-mono">140+ Students</span>
              </div>

              <div className="p-3 bg-surface-2 rounded-xl border border-line flex items-center justify-between">
                <div>
                  <div className="font-bold text-ink">Counselor Time Saved</div>
                  <div className="text-[11px] text-muted">Estimated reduction in manual student record searching</div>
                </div>
                <span className="font-bold text-ink font-mono">3–4 hrs / week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 4: Interactive Pilot Readiness Checklist */}
        <div className="bg-surface-1 border border-line rounded-3xl shadow-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-ok" />
              4. Pilot Readiness Checklist ({checkedCount}/10 Completed)
            </h2>
          </div>

          <p className="text-xs text-muted">
            Interactive readiness criteria to finalize before launching the Spring 2027 pilot at Foothill:
          </p>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
            {[
              { id: 'c1', text: 'Read-only Banner SIS nightly snapshot schedule established' },
              { id: 'c2', text: 'FERPA compliance and student data privacy review approved' },
              { id: 'c3', text: 'Caseload threshold agreed (Top 15 students per counselor per week)' },
              { id: 'c4', text: '8th-grade reading level student SMS templates finalized' },
              { id: 'c5', text: '30-minute counselor workflow walkthrough conducted' },
              { id: 'c6', text: 'Verified college SMS shortcode and outbound number configured' },
              { id: 'c7', text: 'Weekly Friday executive briefing distribution list approved' },
              { id: 'c8', text: 'Historical cohort comparison methodology established' },
              { id: 'c9', text: 'Milestone invoicing agreement ($15,000 fixed fee) prepared' },
              { id: 'c10', text: 'End-of-quarter pilot review and contract conversion date set' },
            ].map(({ id, text }) => (
              <label
                key={id}
                onClick={() => toggleCheck(id)}
                className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                  checklist[id]
                    ? 'bg-ok-tint/30 border-ok/30 text-ink'
                    : 'bg-surface-2/60 border-line text-muted hover:bg-surface-2'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                    checklist[id]
                      ? 'bg-ok border-ok text-white'
                      : 'border-line-dark bg-surface-1'
                  }`}
                >
                  {checklist[id] && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className={`text-xs ${checklist[id] ? 'font-medium text-ink' : 'text-muted'}`}>
                  {text}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
