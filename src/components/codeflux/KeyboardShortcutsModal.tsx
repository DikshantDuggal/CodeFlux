import React from 'react';
import { Command, X, Keyboard, Sparkles, Navigation, Sliders, Info } from 'lucide-react';
import { ShortcutItem } from '../../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: ShortcutItem[];
  lastKeyPressed?: string | null;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  shortcuts,
  lastKeyPressed,
}) => {
  if (!isOpen) return null;

  const categories: Array<'Navigation' | 'Controls' | 'General'> = ['Navigation', 'Controls', 'General'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl rounded-3xl bg-[#090d20]/95 border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>CodeFlux Keyboard Navigation</span>
                {lastKeyPressed && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 animate-pulse">
                    Key: {lastKeyPressed}
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-400">
                Speedrun the CS Laboratory with global hotkeys
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs scrollbar-thin scrollbar-thumb-white/10">
          {categories.map((category) => {
            const items = shortcuts.filter((s) => s.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category} className="space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  {category === 'Navigation' && <Navigation className="w-3.5 h-3.5" />}
                  {category === 'Controls' && <Sliders className="w-3.5 h-3.5" />}
                  {category === 'General' && <Info className="w-3.5 h-3.5" />}
                  <span>{category} Shortcuts</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        item.action();
                        onClose();
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 cursor-pointer transition-colors group"
                    >
                      <span className="text-slate-300 group-hover:text-white font-medium">
                        {item.description}
                      </span>
                      <kbd className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/20 text-[11px] font-mono text-cyan-200 shadow-inner group-hover:border-cyan-400/50 transition-colors">
                        {item.displayKey}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/15 text-slate-300">Esc</kbd> anytime to dismiss</span>
          <span>Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-black/50 border border-white/15 text-slate-300">?</kbd> to open this cheat sheet</span>
        </div>
      </div>
    </div>
  );
};
