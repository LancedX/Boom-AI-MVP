import React from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, Play, Pause, X, Compass, CheckCircle2 } from 'lucide-react';

export const WalkthroughBanner: React.FC = () => {
  const {
    walkthrough,
    walkthroughSteps,
    stopWalkthrough,
    nextWalkthroughStep,
    prevWalkthroughStep,
    toggleAutoPlayWalkthrough,
  } = useApp();

  if (!walkthrough.active) return null;

  const currentStepData = walkthroughSteps[walkthrough.currentStep] || walkthroughSteps[0];
  const progressPercent = ((walkthrough.currentStep + 1) / walkthroughSteps.length) * 100;

  return (
    <div className="bg-ink text-white border-b border-line shadow-big transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-1 rounded-full mb-3 overflow-hidden">
          <div
            className="bg-coral h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Step Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-coral text-white tracking-wide uppercase">
                <Compass className="w-3 h-3" />
                Step {walkthrough.currentStep + 1} of {walkthroughSteps.length}
              </span>
              <span className="text-xs text-faint">Perspective:</span>
              <span className="text-xs font-medium text-white/90 bg-white/10 px-2 py-0.5 rounded">
                {currentStepData.persona}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              {currentStepData.title}
            </h2>

            <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-4xl leading-relaxed">
              {currentStepData.explanation}
            </p>

            {/* Highlights bullets */}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/70">
              {currentStepData.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-ok flex-shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            {currentStepData.actionPrompt && (
              <div className="mt-2 text-xs font-medium text-coral-tint bg-coral/20 px-2.5 py-1 rounded inline-block">
                👉 <span className="font-semibold text-white">Suggested Action:</span>{' '}
                {currentStepData.actionPrompt}
              </div>
            )}
          </div>

          {/* Right: Walkthrough Controls */}
          <div className="flex items-center gap-2 self-start lg:self-center flex-shrink-0">
            {/* Auto Play Toggle */}
            <button
              onClick={toggleAutoPlayWalkthrough}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                walkthrough.isAutoPlaying
                  ? 'bg-warn text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="Automatically advance through demo tour every 5 seconds"
            >
              {walkthrough.isAutoPlaying ? (
                <>
                  <Pause className="w-3 h-3 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Auto-Play</span>
                </>
              )}
            </button>

            {/* Prev */}
            <button
              onClick={prevWalkthroughStep}
              disabled={walkthrough.currentStep === 0}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next */}
            <button
              onClick={nextWalkthroughStep}
              disabled={walkthrough.currentStep === walkthroughSteps.length - 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-coral text-white text-xs font-medium hover:bg-coral-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Next step"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={stopWalkthrough}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors ml-1"
              title="Exit walkthrough"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
