import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Building,
  User,
  Clock,
  Mail,
  Shield,
  RotateCcw,
  CheckCircle,
  Smartphone,
  Save,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    currentCounselor,
    resetDemoData,
    exportReconciliationCSV,
    rules,
    thresholds,
  } = useApp();

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="bg-surface-1 border border-line rounded-3xl p-6 shadow-card space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
          <SettingsIcon className="w-4 h-4 text-coral" />
          <span>Institutional Configuration</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
          Foothill College Settings & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-2xl">
          Configure institutional boundaries, counselor caseload limits, send options, and scheduled digest timings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Institution & Term Info */}
        <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-ink flex items-center gap-2">
            <Building className="w-4 h-4 text-coral" />
            1. College & District Profile
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-muted font-medium">Institution Name</label>
              <input
                type="text"
                value={settings.collegeName}
                onChange={(e) => updateSettings({ collegeName: e.target.value })}
                className="w-full mt-1 p-2.5 bg-surface-2 border border-line rounded-xl text-ink font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-muted font-medium">Target Academic Cycle</label>
              <input
                type="text"
                value={settings.term}
                onChange={(e) => updateSettings({ term: e.target.value })}
                className="w-full mt-1 p-2.5 bg-surface-2 border border-line rounded-xl text-ink focus:outline-none"
              />
            </div>

            <div>
              <label className="text-muted font-medium">Community College District</label>
              <div className="mt-1 p-2.5 bg-surface-2 border border-line rounded-xl text-ink">
                Foothill-De Anza Community College District (FHDA)
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Counselor Caseload & Timing */}
        <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-ink flex items-center gap-2">
            <Clock className="w-4 h-4 text-ok" />
            2. Digest Schedule & Capacity Limits
          </h2>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-muted font-medium">Weekly Digest Day</label>
                <select
                  value={settings.sendDay}
                  onChange={(e) => updateSettings({ sendDay: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-surface-2 border border-line rounded-xl text-ink focus:outline-none"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                </select>
              </div>

              <div>
                <label className="text-muted font-medium">Local Dispatch Time</label>
                <select
                  value={settings.sendTime}
                  onChange={(e) => updateSettings({ sendTime: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-surface-2 border border-line rounded-xl text-ink focus:outline-none"
                >
                  <option value="07:00 AM">07:00 AM (Standard)</option>
                  <option value="08:00 AM">08:00 AM</option>
                  <option value="09:00 AM">09:00 AM</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-muted font-medium">Top N Students per Counselor Digest:</label>
                <span className="font-bold text-ink font-mono">{settings.topN} students</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="5"
                value={settings.topN}
                onChange={(e) => updateSettings({ topN: parseInt(e.target.value, 10) })}
                className="w-full accent-coral cursor-pointer"
              />
              <span className="text-[11px] text-faint">
                Recommended 15 students per counselor per week to prevent notification fatigue.
              </span>
            </div>

            <label className="flex items-center gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.holidayReschedule}
                onChange={(e) => updateSettings({ holidayReschedule: e.target.checked })}
                className="text-coral focus:ring-coral rounded"
              />
              <span className="text-ink">
                Automatically shift Monday holiday dispatches (e.g. Presidents' Day) to Tuesday 7:00 AM
              </span>
            </label>
          </div>
        </div>

        {/* Section 3: IT Send Options */}
        <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-ink flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted" />
            3. Counselor Send Dispatch Options
          </h2>

          <div className="space-y-2 text-xs">
            {[
              {
                opt: 'A' as const,
                title: 'Option A: Direct Outlook Send via Microsoft Graph API',
                desc: 'Messages dispatch directly from counselor’s approved Outlook mailbox upon clicking Approve.',
              },
              {
                opt: 'B' as const,
                title: 'Option B: Drafts Folder Injection',
                desc: 'Boom saves drafts directly into counselor’s Outlook Drafts folder. Counselor opens and clicks Send.',
              },
              {
                opt: 'C' as const,
                title: 'Option C: Local Client Mailto (Zero Permissions Required)',
                desc: 'Clicking Approve generates a mailto link opening counselor’s default email app. Zero Microsoft 365 permissions required.',
              },
            ].map(({ opt, title, desc }) => (
              <label
                key={opt}
                onClick={() => updateSettings({ sendOption: opt })}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  settings.sendOption === opt
                    ? 'bg-surface-2 border-ink text-ink'
                    : 'bg-surface-1 border-line text-muted hover:bg-surface-2'
                }`}
              >
                <input
                  type="radio"
                  name="sendOption"
                  checked={settings.sendOption === opt}
                  onChange={() => updateSettings({ sendOption: opt })}
                  className="mt-0.5 text-coral focus:ring-coral"
                />
                <div>
                  <div className="font-semibold text-ink">{title}</div>
                  <div className="text-[11px] text-muted mt-0.5">{desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Section 4: Demo Environment Controls */}
        <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-ink flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-coral" />
            4. Demo Environment Controls
          </h2>
          <p className="text-xs text-muted">
            Manage local presentation state, export reconciliation logs, or restore initial Foothill dataset.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={exportReconciliationCSV}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-2 hover:bg-surface-3 border border-line text-ink transition-colors"
              >
                Export Current Reconciliation CSV
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Reset demo state to baseline Foothill dataset?')) {
                    resetDemoData();
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-coral-tint hover:bg-coral-tint/80 text-coral-ink border border-coral/30 transition-colors"
              >
                Reset Demo to Clean State
              </button>
            </div>

            <div className="p-3 bg-surface-2/60 rounded-xl border border-line text-[11px] text-muted">
              <b>Volatile Presentation Ledger:</b> Boom AI operates entirely in-memory with local persistence. No external database writes are made during this presentation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
