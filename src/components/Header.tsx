import React from 'react';
import { useApp } from '../context/AppContext';
import { Play, Square, RotateCcw, Upload, ShieldCheck, UserCheck, Calendar } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentCounselor,
    allCounselors,
    selectedCounselorId,
    setSelectedCounselorId,
    walkthrough,
    startWalkthrough,
    stopWalkthrough,
    resetDemoData,
    setIsImportModalOpen,
    settings,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-surface-1 border-b border-line shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & College Context */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Boom AI Logo with 24 spokes and 1 coral seed */}
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0" title="Boom AI">
              <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
                <g stroke="#151517" strokeWidth="1.6" strokeLinecap="round">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
                    const x = (32 + 27.5 * Math.cos(angle)).toFixed(2);
                    const y = (32 + 27.5 * Math.sin(angle)).toFixed(2);
                    return <line key={i} x1="32" y1="32" x2={x} y2={y} />;
                  })}
                </g>
                {Array.from({ length: 24 }).map((_, i) => {
                  const angle = (i / 24) * Math.PI * 2 - Math.PI / 2;
                  const x = (32 + 27.5 * Math.cos(angle)).toFixed(2);
                  const y = (32 + 27.5 * Math.sin(angle)).toFixed(2);
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="2.5"
                      fill={i === 3 ? '#D2553A' : '#151517'}
                    />
                  );
                })}
              </svg>
            </div>

            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="font-semibold text-base sm:text-lg text-ink tracking-tight flex items-center gap-1">
                Boom AI
                <span className="text-muted font-normal text-xs sm:text-sm truncate hidden md:inline">
                  · {settings.collegeName}
                </span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-coral-tint text-coral-ink border border-coral/20 whitespace-nowrap">
                Spring 2027 Pilot
              </span>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Counselor Selector Dropdown */}
            <div className="relative hidden md:flex items-center">
              <label htmlFor="counselor-select" className="sr-only">Select Counselor</label>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-2 border border-line-dark rounded-lg text-xs font-medium text-ink">
                <UserCheck className="w-3.5 h-3.5 text-coral" />
                <select
                  id="counselor-select"
                  value={selectedCounselorId}
                  onChange={(e) => setSelectedCounselorId(e.target.value)}
                  className="bg-transparent border-0 text-xs font-medium text-ink focus:outline-none cursor-pointer"
                >
                  <option value="all">All Counselors (Entire Cohort)</option>
                  {allCounselors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Guided Walkthrough Tour Button */}
            <button
              onClick={walkthrough.active ? stopWalkthrough : startWalkthrough}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                walkthrough.active
                  ? 'bg-coral text-white shadow-sm ring-2 ring-coral/30'
                  : 'bg-ink text-white hover:bg-black'
              }`}
              title="Interactive guided demonstration walkthrough for college leadership"
            >
              {walkthrough.active ? (
                <>
                  <Square className="w-3 h-3 fill-current" />
                  <span>Exit Tour</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span className="hidden sm:inline">Guided Demo Tour</span>
                  <span className="sm:hidden">Tour</span>
                </>
              )}
            </button>

            {/* CSV Import Button */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-line-dark bg-surface-1 hover:bg-surface-2 text-ink transition-colors"
              title="Upload new student CSV or review dataset"
            >
              <Upload className="w-3.5 h-3.5 text-muted" />
              <span className="hidden lg:inline">Import CSV</span>
            </button>

            {/* Reset Demo Button */}
            <button
              onClick={() => {
                if (window.confirm('Reset demo state to baseline Foothill dataset? Any unsaved edits will be refreshed.')) {
                  resetDemoData();
                }
              }}
              className="p-1.5 rounded-lg text-xs font-medium text-muted hover:text-ink hover:bg-surface-2 transition-colors"
              title="Reset demo data to initial Foothill state"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
