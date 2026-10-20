import { useEffect, useState, useCallback } from 'react';
import { ActiveTab } from '../components/codeflux/CodeFluxNavbar';

export interface ShortcutItem {
  key: string;
  displayKey: string;
  description: string;
  category: 'Navigation' | 'Controls' | 'General';
  action: () => void;
}

interface UseKeyboardShortcutsOptions {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onToggleAiTutor?: () => void;
  onOpenTour?: () => void;
}

export function useKeyboardShortcuts({
  activeTab,
  onSelectTab,
  onToggleAiTutor,
  onOpenTour,
}: UseKeyboardShortcutsOptions) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);

  const toggleHelp = useCallback(() => {
    setIsHelpOpen((prev) => !prev);
  }, []);

  const closeHelp = useCallback(() => {
    setIsHelpOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut key events if user is actively typing in form inputs, textareas, or contentEditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      // Escape to close help modal
      if (e.key === 'Escape') {
        if (isHelpOpen) {
          e.preventDefault();
          setIsHelpOpen(false);
          return;
        }
      }

      // '?' (Shift + /) or 'h' to toggle shortcuts cheat sheet
      if ((e.key === '?' || (e.shiftKey && e.key === '/')) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        toggleHelp();
        return;
      }

      // Navigation Shortcuts: Support both (Ctrl or Alt or Cmd) + Number, OR plain number keys when outside inputs
      const isModifierNav = e.ctrlKey || e.altKey || e.metaKey;
      const key = e.key;

      const tabMap: Record<string, ActiveTab> = {
        '1': 'overview',
        '2': 'lab',
        '3': 'race',
        '4': 'predict',
        '5': 'quiz',
        '6': 'debug',
        '7': 'game',
        '8': 'analytics',
        '9': 'resources',
      };

      if (tabMap[key] && (isModifierNav || (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey))) {
        // If plain numbers, only trigger if not in inputs (already checked above)
        e.preventDefault();
        onSelectTab(tabMap[key]);
        setLastKeyPressed(`${isModifierNav ? 'Ctrl+' : ''}${key}`);
        setTimeout(() => setLastKeyPressed(null), 1200);
        return;
      }

      // AI Tutor Shortcut: 't' or Ctrl+K or Cmd+K
      if ((e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        if (onToggleAiTutor) {
          e.preventDefault();
          onToggleAiTutor();
          setLastKeyPressed(e.key.toUpperCase());
          setTimeout(() => setLastKeyPressed(null), 1200);
        }
      }

      // Onboarding Tour Shortcut: 'o' or Alt+O
      if ((e.key.toLowerCase() === 'o' && !e.ctrlKey && !e.metaKey) || (e.altKey && e.key.toLowerCase() === 'o')) {
        if (onOpenTour) {
          e.preventDefault();
          onOpenTour();
          setLastKeyPressed('TOUR');
          setTimeout(() => setLastKeyPressed(null), 1200);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectTab, onToggleAiTutor, onOpenTour, isHelpOpen, toggleHelp]);

  const shortcutsList: ShortcutItem[] = [
    {
      key: '1',
      displayKey: '1 or Ctrl+1',
      description: 'Switch to Overview',
      category: 'Navigation',
      action: () => onSelectTab('overview'),
    },
    {
      key: '2',
      displayKey: '2 or Ctrl+2',
      description: 'Open Algorithm Lab (WATCH)',
      category: 'Navigation',
      action: () => onSelectTab('lab'),
    },
    {
      key: '3',
      displayKey: '3 or Ctrl+3',
      description: 'Open Algorithm Race Track (RACE)',
      category: 'Navigation',
      action: () => onSelectTab('race'),
    },
    {
      key: '4',
      displayKey: '4 or Ctrl+4',
      description: 'Open Predict Next Step (PREDICT)',
      category: 'Navigation',
      action: () => onSelectTab('predict'),
    },
    {
      key: '5',
      displayKey: '5 or Ctrl+5',
      description: 'Open Complexity & Big-O Quiz',
      category: 'Navigation',
      action: () => onSelectTab('quiz'),
    },
    {
      key: '6',
      displayKey: '6 or Ctrl+6',
      description: 'Open Algorithm Debugging Mode 🐛',
      category: 'Navigation',
      action: () => onSelectTab('debug'),
    },
    {
      key: '7',
      displayKey: '7 or Ctrl+7',
      description: 'Play Sort Rush Arcade Game',
      category: 'Navigation',
      action: () => onSelectTab('game'),
    },
    {
      key: '8',
      displayKey: '8 or Ctrl+8',
      description: 'Open Tech Stack & Analytics Studio',
      category: 'Navigation',
      action: () => onSelectTab('analytics'),
    },
    {
      key: '9',
      displayKey: '9 or Ctrl+9',
      description: 'View Learning Resources & Cheatsheet',
      category: 'Navigation',
      action: () => onSelectTab('resources'),
    },
    {
      key: 't',
      displayKey: 'T or Ctrl+K',
      description: 'Toggle AI Tutor Assistant',
      category: 'Controls',
      action: () => onToggleAiTutor?.(),
    },
    {
      key: 'o',
      displayKey: 'O or Alt+O',
      description: 'Start Interactive Onboarding Tour',
      category: 'General',
      action: () => onOpenTour?.(),
    },
    {
      key: '?',
      displayKey: '? or Shift+/',
      description: 'Toggle Shortcuts Cheat Sheet',
      category: 'General',
      action: toggleHelp,
    },
    {
      key: 'Esc',
      displayKey: 'Esc',
      description: 'Close Modals / Overlays',
      category: 'General',
      action: closeHelp,
    },
  ];

  return {
    isHelpOpen,
    toggleHelp,
    closeHelp,
    lastKeyPressed,
    shortcutsList,
    activeTab,
  };
}
