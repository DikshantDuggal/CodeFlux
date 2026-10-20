import React from 'react';
import {
  Layers,
  Activity,
  Zap,
  HelpCircle,
  BookOpen,
  BarChart3,
  BrainCircuit,
  Gamepad2,
  Bug,
  Keyboard,
  Compass,
  Sparkles,
} from 'lucide-react';

export type ActiveTab =
  | 'overview'
  | 'lab'
  | 'race'
  | 'predict'
  | 'quiz'
  | 'debug'
  | 'game'
  | 'analytics'
  | 'resources';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenShortcuts?: () => void;
  onOpenTour?: () => void;
}

export const CodeFluxNavbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenShortcuts,
  onOpenTour,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#050713]/85 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-3 transition-colors shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('overview')}
          className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform border border-white/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                CodeFlux
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                CS Lab
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Interactive Computer Science Laboratory & Algorithm Engine
            </p>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => onSelectTab('overview')}
            title="Overview (1 or Ctrl+1)"
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap border ${
              activeTab === 'overview'
                ? 'bg-white/10 text-cyan-300 border-white/20 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => onSelectTab('lab')}
            title="Algorithm Lab (2 or Ctrl+2)"
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap border ${
              activeTab === 'lab'
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Lab</span>
            <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-cyan-950/90 text-cyan-300">
              Watch
            </span>
          </button>

          <button
            onClick={() => onSelectTab('race')}
            title="Algorithm Race (3 or Ctrl+3)"
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap border ${
              activeTab === 'race'
                ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Race</span>
          </button>

          <button
            onClick={() => onSelectTab('predict')}
            title="Predict Next Step (4 or Ctrl+4)"
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap border ${
              activeTab === 'predict'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Predict</span>
          </button>

          {/* Complexity Quiz Tab */}
          <button
            onClick={() => onSelectTab('quiz')}
            title="Complexity Quiz (5 or Ctrl+5)"
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap border ${
              activeTab === 'quiz'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-sm shadow-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Quiz</span>
          </button>

          {/* Algorithm Debugging Mode Tab */}
          <button
            onClick={() => onSelectTab('debug')}
            title="Algorithm Debugging Mode (6 or Ctrl+6)"
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap border ${
              activeTab === 'debug'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm shadow-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Bug className="w-3.5 h-3.5 text-rose-400" />
            <span>Debug</span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-800/40">
              🐛
            </span>
          </button>

          {/* Sorting Arcade Game Tab */}
          <button
            onClick={() => onSelectTab('game')}
            title="Sort Rush Arcade (7 or Ctrl+7)"
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap border ${
              activeTab === 'game'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Sort Rush</span>
          </button>

          {/* Tech Stack & Analytics Tab */}
          <button
            onClick={() => onSelectTab('analytics')}
            title="Stack & Analytics (8 or Ctrl+8)"
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap border ${
              activeTab === 'analytics'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Stack & Lab</span>
            <span className="sm:hidden">Stack</span>
          </button>

          <button
            onClick={() => onSelectTab('resources')}
            title="Resources & Cheatsheet (9 or Ctrl+9)"
            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap border ${
              activeTab === 'resources'
                ? 'bg-white/10 text-cyan-300 border-white/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Docs</span>
          </button>

          {/* Tour Walkthrough Trigger Button */}
          {onOpenTour && (
            <button
              onClick={onOpenTour}
              className="px-2.5 py-1.5 rounded-xl border border-white/10 hover:border-cyan-400/50 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition-all flex items-center gap-1.5 text-xs font-mono ml-1"
              title="Interactive Onboarding Tour"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xl:inline">Tour</span>
            </button>
          )}

          {/* Keyboard Shortcuts Trigger Button */}
          {onOpenShortcuts && (
            <button
              onClick={onOpenShortcuts}
              className="px-2.5 py-1.5 rounded-xl border border-white/10 hover:border-cyan-400/50 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-cyan-300 transition-all flex items-center gap-1.5 text-xs font-mono ml-1"
              title="Global Keyboard Shortcuts (Press ?)"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Keys</span>
              <kbd className="text-[9px] bg-black/60 px-1 py-0.5 rounded border border-white/10 text-cyan-300">
                ?
              </kbd>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
