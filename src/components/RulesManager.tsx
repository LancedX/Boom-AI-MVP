import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RiskConfig } from '../types';
import {
  Sliders,
  RotateCcw,
  Save,
  CheckCircle,
  AlertTriangle,
  History,
  ShieldCheck,
  Info,
  Scale,
} from 'lucide-react';

export const RulesManager: React.FC = () => {
  const {
    rules,
    thresholds,
    ruleHistory,
    currentVersion,
    students,
    updateRule,
    updateThresholds,
    saveRuleVersion,
    restoreRuleVersion,
  } = useApp();

  const [newVersionName, setNewVersionName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Live impact calculation
  const highCount = students.filter((s) => s.riskTier === 'High').length;
  const mediumCount = students.filter((s) => s.riskTier === 'Medium').length;
  const watchCount = students.filter((s) => s.riskTier === 'Watch').length;

  const handleSaveVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVersionName.trim()) {
      saveRuleVersion(newVersionName.trim());
      setNewVersionName('');
      setShowSaveDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Institutional Notice */}
      <div className="bg-surface-1 border border-line rounded-3xl p-6 shadow-card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-coral" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Explainable Prioritization Engine
            </span>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-surface-2 border border-line text-ink font-semibold">
            Active: {currentVersion}
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
            Deterministic Student Ranking Rules
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-3xl mt-1 leading-relaxed">
            Boom AI enforces absolute algorithmic transparency. Students are evaluated against explicit, auditable rules rather than opaque generative AI models. Every score can be decomposed into plain mathematical contributions.
          </p>
        </div>

        {/* Demo Disclaimer Alert */}
        <div className="p-3.5 bg-warn-tint/60 border border-warn/30 rounded-xl text-xs text-warn flex items-start gap-2.5">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-warn" />
          <div>
            <b className="font-semibold">Institutional Governance Notice:</b> Rule weights and thresholds displayed here are illustrative demonstration defaults for Foothill College. Any production changes require review and approval by the Foothill Academic Senate and Counseling Department.
          </div>
        </div>
      </div>

      {/* Live Impact Preview Bar */}
      <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
            Live Caseload Impact (Recalculated in Real-Time)
          </h2>
          <span className="text-xs text-muted">50 Student Cohort</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-coral-tint/40 border border-coral/30 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-coral-ink">High Priority (≥ {thresholds.high} pts)</div>
              <div className="text-2xl font-bold text-coral-ink mt-0.5">{highCount} Students</div>
            </div>
            <div className="text-xs text-coral-ink font-mono">{Math.round((highCount / 50) * 100)}%</div>
          </div>

          <div className="p-3 bg-warn-tint/40 border border-warn/30 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-warn">Medium Priority (≥ {thresholds.medium} pts)</div>
              <div className="text-2xl font-bold text-warn mt-0.5">{mediumCount} Students</div>
            </div>
            <div className="text-xs text-warn font-mono">{Math.round((mediumCount / 50) * 100)}%</div>
          </div>

          <div className="p-3 bg-surface-2 border border-line rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-muted">Watchlist (&lt; {thresholds.medium} pts)</div>
              <div className="text-2xl font-bold text-ink mt-0.5">{watchCount} Students</div>
            </div>
            <div className="text-xs text-muted font-mono">{Math.round((watchCount / 50) * 100)}%</div>
          </div>
        </div>
      </div>

      {/* Rules Configuration Table */}
      <div className="bg-surface-1 border border-line rounded-3xl shadow-card overflow-hidden">
        <div className="p-5 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-ink">Active Rule Definitions & Weights</h2>
            <p className="text-xs text-muted">Adjust sliders or toggle rules to see immediate cohort re-scoring</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSaveDialog(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-coral text-white hover:bg-coral-ink transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Version Snapshot</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-line">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-5 transition-colors ${
                rule.enabled ? 'hover:bg-surface-2/40' : 'bg-surface-2/60 opacity-60'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Rule Info */}
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-3 text-muted font-semibold">
                      {rule.id}
                    </span>
                    <span className="font-bold text-sm text-ink">{rule.name}</span>
                    {!rule.enabled && (
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-surface-3 text-faint">
                        Disabled
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {rule.conditionDescription}
                  </p>
                </div>

                {/* Controls: Slider & Enable Toggle */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  {/* Slider */}
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="5"
                      disabled={!rule.enabled}
                      value={rule.points}
                      onChange={(e) => updateRule(rule.id, parseInt(e.target.value, 10), rule.enabled)}
                      className="w-32 accent-coral cursor-pointer disabled:opacity-40"
                    />
                    <span className="w-12 text-center text-xs font-bold font-mono px-2 py-1 bg-surface-2 rounded-lg border border-line text-ink">
                      {rule.points} pts
                    </span>
                  </div>

                  {/* Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={(e) => updateRule(rule.id, rule.points, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-line-dark after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-coral"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threshold Configuration & Version History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority Thresholds */}
        <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <Sliders className="w-4 h-4 text-coral" />
            Priority Cutoff Thresholds
          </h3>
          <p className="text-xs text-muted">
            Configure the point thresholds that assign students into High, Medium, and Watchlist tiers.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-coral-ink">High Priority Cutoff:</span>
                <span className="font-mono font-bold text-ink">≥ {thresholds.high} points</span>
              </div>
              <input
                type="range"
                min="30"
                max="80"
                step="5"
                value={thresholds.high}
                onChange={(e) => updateThresholds(parseInt(e.target.value, 10), thresholds.medium)}
                className="w-full accent-coral cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-warn">Medium Priority Cutoff:</span>
                <span className="font-mono font-bold text-ink">≥ {thresholds.medium} points</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={thresholds.medium}
                onChange={(e) => updateThresholds(thresholds.high, parseInt(e.target.value, 10))}
                className="w-full accent-warn cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Version History & Rollback */}
        <div className="bg-surface-1 border border-line rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <History className="w-4 h-4 text-muted" />
            Rule Version History & Rollback
          </h3>
          <p className="text-xs text-muted">
            All rule modifications are versioned. You can restore prior verified rule sets instantly.
          </p>

          <div className="space-y-2 pt-1 max-h-48 overflow-y-auto">
            {ruleHistory.map((ver, idx) => (
              <div
                key={idx}
                className="p-3 bg-surface-2 rounded-xl border border-line flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-ink">{ver.version}</div>
                  <div className="text-[10px] text-faint">
                    {new Date(ver.updatedAt).toLocaleDateString()} · High: ≥{ver.thresholds.high} pts
                  </div>
                </div>

                <button
                  onClick={() => restoreRuleVersion(ver)}
                  disabled={currentVersion === ver.version}
                  className="px-2.5 py-1 rounded-lg border border-line bg-surface-1 hover:bg-surface-3 text-ink disabled:opacity-40 font-medium transition-colors"
                >
                  {currentVersion === ver.version ? 'Active' : 'Restore'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Version Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveVersion} className="bg-surface-1 border border-line rounded-3xl shadow-big max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-ink">Save Rule Configuration Version</h3>
            <p className="text-xs text-muted">
              Enter a version identifier or name to snapshot the current rule weights and thresholds.
            </p>

            <input
              type="text"
              placeholder="e.g. v1.3 Academic Senate Approved"
              value={newVersionName}
              onChange={(e) => setNewVersionName(e.target.value)}
              className="w-full p-3 bg-surface-2 border border-line rounded-xl text-xs sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral"
              autoFocus
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-line hover:bg-surface-2 text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newVersionName.trim()}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-coral text-white hover:bg-coral-ink disabled:opacity-40"
              >
                Save Snapshot
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
