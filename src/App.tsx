import React, { useState } from 'react';
import { CodeFluxNavbar, ActiveTab } from './components/codeflux/CodeFluxNavbar';
import { LandingOverview } from './components/codeflux/LandingOverview';
import { AlgorithmLab } from './components/codeflux/AlgorithmLab';
import { AlgorithmRace } from './components/codeflux/AlgorithmRace';
import { PredictMode } from './components/codeflux/PredictMode';
import { ComplexityQuiz } from './components/codeflux/ComplexityQuiz';
import { AlgorithmDebug } from './components/codeflux/AlgorithmDebug';
import { SortingGame } from './components/codeflux/SortingGame';
import { TechStackAnalytics } from './components/codeflux/TechStackAnalytics';
import { LearningResources } from './components/codeflux/LearningResources';
import { AIChatbot } from './components/codeflux/AIChatbot';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { KeyboardShortcutsModal } from './components/codeflux/KeyboardShortcutsModal';
import { OnboardingTour, isTourCompleted } from './components/codeflux/OnboardingTour';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [currentAlgorithm, setCurrentAlgorithm] = useState<string>('Bubble Sort');
  const [isAiTutorOpen, setIsAiTutorOpen] = useState<boolean>(false);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(() => !isTourCompleted());

  // Global Keyboard Shortcuts Manager Hook
  const {
    isHelpOpen,
    toggleHelp,
    closeHelp,
    lastKeyPressed,
    shortcutsList,
  } = useKeyboardShortcuts({
    activeTab,
    onSelectTab: setActiveTab,
    onToggleAiTutor: () => setIsAiTutorOpen((prev) => !prev),
    onOpenTour: () => setIsTourOpen(true),
  });

  return (
    <div className="min-h-screen bg-[#050713] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black relative overflow-x-hidden">
      {/* Evervault Ambient Radial Aura Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(120,119,198,0.22),rgba(255,255,255,0))] blur-2xl" />
        <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 -right-40 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Glassmorphic Navbar with Hotkey & Tour Support */}
      <CodeFluxNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenShortcuts={toggleHelp}
        onOpenTour={() => setIsTourOpen(true)}
      />

      {/* Main Experience Router */}
      <main className="flex-1 w-full relative z-10 pb-16">
        {activeTab === 'overview' && (
          <LandingOverview onSelectTab={setActiveTab} />
        )}
        {activeTab === 'lab' && (
          <AlgorithmLab />
        )}
        {activeTab === 'race' && (
          <AlgorithmRace />
        )}
        {activeTab === 'predict' && (
          <PredictMode />
        )}
        {activeTab === 'quiz' && (
          <ComplexityQuiz />
        )}
        {activeTab === 'debug' && (
          <AlgorithmDebug />
        )}
        {activeTab === 'game' && (
          <SortingGame />
        )}
        {activeTab === 'analytics' && (
          <TechStackAnalytics />
        )}
        {activeTab === 'resources' && (
          <LearningResources />
        )}
      </main>

      {/* Global AI Chatbot Component powered by Gemini */}
      <AIChatbot
        currentAlgorithm={currentAlgorithm}
        isOpen={isAiTutorOpen}
        onToggle={() => setIsAiTutorOpen((prev) => !prev)}
        onClose={() => setIsAiTutorOpen(false)}
      />

      {/* Interactive Onboarding Tour Walkthrough */}
      <OnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onSelectTab={setActiveTab}
        activeTab={activeTab}
      />

      {/* Global Keyboard Shortcuts Modal (? or Shift+/) */}
      <KeyboardShortcutsModal
        isOpen={isHelpOpen}
        onClose={closeHelp}
        shortcuts={shortcutsList}
        lastKeyPressed={lastKeyPressed}
      />

      {/* Transient Key Pressed Indicator Toast */}
      {lastKeyPressed && (
        <div className="fixed bottom-6 left-6 z-50 pointer-events-none px-3.5 py-2 rounded-2xl bg-[#090d20]/90 border border-cyan-400/40 backdrop-blur-xl shadow-2xl flex items-center gap-2 text-xs font-mono text-cyan-200 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Navigated via</span>
          <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-white/20 text-white font-bold">
            {lastKeyPressed}
          </kbd>
        </div>
      )}
    </div>
  );
};

export default App;
