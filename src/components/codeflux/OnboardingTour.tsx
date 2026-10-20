import React, { useState, useEffect, useCallback } from 'react';
import {
  Layers,
  Activity,
  Zap,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Bug,
  Compass,
  Play,
  RotateCcw,
} from 'lucide-react';
import { ActiveTab } from './CodeFluxNavbar';

export interface TourStep {
  id: string;
  tab: ActiveTab;
  badge: string;
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  borderColor: string;
  bgGlow: string;
  description: string;
  highlights: string[];
  actionLabel?: string;
}

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  activeTab: ActiveTab;
}

const TOUR_STORAGE_KEY = 'codeflux_onboarding_completed_v1';

export const isTourCompleted = (): boolean => {
  try {
    return localStorage.getItem(TOUR_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const markTourCompleted = (): void => {
  try {
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  } catch {
    // ignore
  }
};

export const resetTourStatus = (): void => {
  try {
    localStorage.removeItem(TOUR_STORAGE_KEY);
  } catch {
    // ignore
  }
};

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  activeTab,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(true);

  const TOUR_STEPS: TourStep[] = [
    {
      id: 'step-overview',
      tab: 'overview',
      badge: 'Step 1 of 4 • Welcome',
      title: 'Welcome to CodeFlux CS Laboratory',
      icon: <Layers className="w-5 h-5 text-cyan-300" />,
      accentColor: 'from-cyan-400 to-blue-500',
      borderColor: 'border-cyan-500/40',
      bgGlow: 'bg-cyan-500/10',
      description:
        'Traditional computer science education traps learners in passive video lectures. CodeFlux transforms algorithms into tactile experiments that you can scrub, race, predict, and debug.',
      highlights: [
        'Explore 5 fundamental sorting algorithms with deterministic execution state',
        'Compare asymptotic growth with empirical Seaborn & Matplotlib analytics',
        'Use keyboard hotkeys (1-9) or press ? anytime to speedrun navigation',
      ],
      actionLabel: 'Explore Algorithm Lab',
    },
    {
      id: 'step-lab',
      tab: 'lab',
      badge: 'Step 2 of 4 • WATCH',
      title: 'Algorithm Laboratory',
      icon: <Activity className="w-5 h-5 text-cyan-300" />,
      accentColor: 'from-cyan-400 via-teal-400 to-indigo-500',
      borderColor: 'border-cyan-500/40',
      bgGlow: 'bg-cyan-500/15',
      description:
        'The core laboratory engine. Step through algorithm executions forward and backward with millisecond-precision controls and synchronized pseudocode tracing.',
      highlights: [
        'Deterministic Stepper: Scrub step-by-step or play with adjustable speed',
        'Color-Coded Pointer States: Comparing, swapping, pivot selection, and sorted bounds',
        'Input Generators: Random, Reversed (worst-case), Nearly Sorted, and Duplicate arrays',
      ],
      actionLabel: 'Enter Race Arena',
    },
    {
      id: 'step-race',
      tab: 'race',
      badge: 'Step 3 of 4 • COMPARE',
      title: 'Algorithm Race Arena',
      icon: <Zap className="w-5 h-5 text-indigo-300" />,
      accentColor: 'from-indigo-400 via-purple-400 to-cyan-400',
      borderColor: 'border-indigo-500/40',
      bgGlow: 'bg-indigo-500/15',
      description:
        'Settle algorithmic efficiency debates empirically. Run two algorithms head-to-head on the exact same randomized input array and watch asymptotic complexity unfold live.',
      highlights: [
        'Side-by-Side Dual Visualizer: Bubble, Selection, Insertion, Quick, and Merge Sort',
        'Live Telemetry: Real-time comparison counts, memory swaps, and total steps',
        'Normalized Asymptotics: Witness firsthand why O(N log N) dominates O(N²)',
      ],
      actionLabel: 'Try Active Recall',
    },
    {
      id: 'step-predict',
      tab: 'predict',
      badge: 'Step 4 of 4 • LEARN',
      title: 'Active Recall Prediction',
      icon: <HelpCircle className="w-5 h-5 text-amber-300" />,
      accentColor: 'from-amber-400 via-orange-400 to-rose-400',
      borderColor: 'border-amber-500/40',
      bgGlow: 'bg-amber-500/15',
      description:
        'Passive watching leads to illusions of competence. Predict Mode pauses the sorting execution at critical branches and challenges you to predict the next swap or partition pivot.',
      highlights: [
        'Critical Branch Pauses: Test your mental model before the machine computes',
        'Invariant Reasoning: Immediate feedback explaining why a choice is correct or flawed',
        'Streak Multipliers: Earn points and reinforce operational intuition',
      ],
      actionLabel: 'Complete Tour & Start Exploring',
    },
  ];

  // Sync tab with step
  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < TOUR_STEPS.length) {
        setCurrentStepIndex(index);
        const targetTab = TOUR_STEPS[index].tab;
        if (targetTab !== activeTab) {
          onSelectTab(targetTab);
        }
      }
    },
    [TOUR_STEPS, activeTab, onSelectTab]
  );

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      goToStep(currentStepIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  const handleComplete = () => {
    if (dontShowAgain) {
      markTourCompleted();
    }
    onClose();
  };

  // Keyboard navigation for tour
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const progressPercent = ((currentStepIndex + 1) / TOUR_STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Tour Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg rounded-3xl bg-[#090d22]/95 border ${currentStep.borderColor} shadow-[0_25px_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden flex flex-col transition-all duration-300 animate-in zoom-in-95`}
      >
        {/* Top Progress Bar */}
        <div className="h-1.5 w-full bg-white/10 relative overflow-hidden">
          <div
            style={{ width: `${progressPercent}%` }}
            className={`h-full bg-gradient-to-r ${currentStep.accentColor} transition-all duration-300`}
          />
        </div>

        {/* Card Header */}
        <div className="px-6 pt-5 pb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-2xl bg-white/5 border border-white/10 shadow-inner flex items-center justify-center`}
            >
              {currentStep.icon}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 font-bold">
                {currentStep.badge}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {currentStep.title}
              </h2>
            </div>
          </div>

          <button
            onClick={handleComplete}
            title="Skip Tour"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Body */}
        <div className="px-6 py-3 space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
            {currentStep.description}
          </p>

          {/* Highlights List */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Key Capabilities:
            </div>
            <ul className="space-y-1.5">
              {currentStep.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-[11px] leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Navigation Step Indicators (Dots) */}
        <div className="px-6 py-2 flex items-center justify-between border-t border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => goToStep(idx)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  idx === currentStepIndex
                    ? `w-6 bg-gradient-to-r ${currentStep.accentColor}`
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={`Jump to ${step.title}`}
              />
            ))}
          </div>

          <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded bg-black/40 border-white/20 text-cyan-500 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Don't show again</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between gap-3">
          <button
            onClick={handleComplete}
            className="text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors"
          >
            Skip Walkthrough
          </button>

          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className={`px-4 py-2 rounded-xl bg-gradient-to-r ${currentStep.accentColor} hover:brightness-110 text-black font-extrabold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5`}
            >
              <span>{currentStep.actionLabel || (currentStepIndex === TOUR_STEPS.length - 1 ? 'Start Experimenting' : 'Next')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
