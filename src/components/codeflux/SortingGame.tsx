import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Flame,
  Trophy,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  Volume2,
  VolumeX,
  Play,
  Pause,
} from 'lucide-react';

export const SortingGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('codeflux_game_highscore')) || 0;
  });

  const [pair, setPair] = useState<{ left: number; right: number }>({ left: 42, right: 17 });
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Web Audio synth blips
  const playSound = (isSuccess: boolean) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isSuccess) {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else {
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  const generateNewPair = () => {
    const l = Math.floor(Math.random() * 85) + 10;
    let r = Math.floor(Math.random() * 85) + 10;
    if (l === r) r += 5;
    setPair({ left: l, right: r });
    setFeedback(null);
  };

  const handleDecision = (playerChoseSwap: boolean) => {
    if (!isPlaying) return;

    // Rule: Sorting in ASCENDING order (left should be <= right)
    // Correct action: if left > right, player MUST swap. If left < right, player MUST NOT swap.
    const shouldSwap = pair.left > pair.right;
    const isCorrect = playerChoseSwap === shouldSwap;

    if (isCorrect) {
      playSound(true);
      setFeedback('correct');
      const comboMultiplier = combo >= 5 ? 2.5 : combo >= 2 ? 1.5 : 1.0;
      const points = Math.round(100 * comboMultiplier);
      const newScore = score + points;
      setScore(newScore);
      setCombo((prev) => prev + 1);
      setTimeLeft((prev) => Math.min(45, prev + 1.5)); // +1.5s time bonus

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('codeflux_game_highscore', String(newScore));
      }
    } else {
      playSound(false);
      setFeedback('wrong');
      setCombo(0);
      setTimeLeft((prev) => Math.max(0, prev - 3)); // -3s penalty
    }

    setTimeout(() => {
      generateNewPair();
    }, 180);
  };

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setTimeLeft(30);
    setIsPlaying(true);
    generateNewPair();
  };

  // Timer loop
  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // Keyboard shortcut listener (Left Arrow / A = SWAP, Right Arrow / D = KEEP)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a' || e.code === 'Space') {
        handleDecision(true);
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd' || e.code === 'Enter') {
        handleDecision(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, pair]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs font-mono mb-2 shadow-sm">
              <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Algorithmic Arcade Simulation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sort Rush — CPU Inversion Reflex
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              You are the sorting execution engine! Compare incoming pairs in real-time. Decide: <b>SWAP</b> or <b>KEEP</b> before the timer expires!
            </p>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all self-start sm:self-center"
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>

        {/* HUD Scoreboard */}
        <div className="grid grid-cols-4 gap-3 mt-6 pt-4 border-t border-white/10">
          <div className="bg-black/40 border border-white/10 p-3 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Score</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-cyan-300">{score}</span>
          </div>

          <div className="bg-black/40 border border-white/10 p-3 rounded-xl text-center">
            <div className="flex items-center justify-center gap-1">
              <Flame className={`w-3 h-3 ${combo > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
              <span className="text-[10px] font-mono text-slate-400 uppercase">Combo</span>
            </div>
            <span className="text-lg sm:text-xl font-bold font-mono text-amber-300">{combo}x</span>
          </div>

          <div className="bg-black/40 border border-white/10 p-3 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Timer</span>
            <span className={`text-lg sm:text-xl font-bold font-mono ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-emerald-300'}`}>
              {timeLeft}s
            </span>
          </div>

          <div className="bg-black/40 border border-white/10 p-3 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Best</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-purple-300">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Main Playfield Card */}
      <div className="relative bg-slate-900/50 border border-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-10 text-center space-y-8 shadow-2xl overflow-hidden min-h-[360px] flex flex-col justify-center items-center">
        {isPlaying ? (
          <>
            <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              ASCENDING ORDER INVARIANT: A[i] ≤ A[i+1]
            </div>

            {/* Elements Register Display */}
            <div className="flex items-center justify-center gap-8 sm:gap-14 my-4">
              {/* Left Element */}
              <div
                className={`w-28 sm:w-36 h-36 sm:h-44 rounded-2xl border flex flex-col items-center justify-center transition-all duration-150 shadow-2xl ${
                  feedback === 'correct'
                    ? 'border-emerald-400 bg-emerald-500/20'
                    : feedback === 'wrong'
                    ? 'border-rose-400 bg-rose-500/20'
                    : 'border-cyan-500/50 bg-cyan-500/10'
                }`}
              >
                <span className="text-4xl sm:text-5xl font-black font-mono text-white">
                  {pair.left}
                </span>
                <span className="text-[10px] font-mono text-cyan-300 mt-2">Index [i]</span>
              </div>

              {/* Comparison symbol */}
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 text-lg font-mono">
                VS
              </div>

              {/* Right Element */}
              <div
                className={`w-28 sm:w-36 h-36 sm:h-44 rounded-2xl border flex flex-col items-center justify-center transition-all duration-150 shadow-2xl ${
                  feedback === 'correct'
                    ? 'border-emerald-400 bg-emerald-500/20'
                    : feedback === 'wrong'
                    ? 'border-rose-400 bg-rose-500/20'
                    : 'border-indigo-500/50 bg-indigo-500/10'
                }`}
              >
                <span className="text-4xl sm:text-5xl font-black font-mono text-white">
                  {pair.right}
                </span>
                <span className="text-[10px] font-mono text-indigo-300 mt-2">Index [i+1]</span>
              </div>
            </div>

            {/* Decision Action Buttons */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <button
                onClick={() => handleDecision(true)}
                className="py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold text-sm sm:text-base shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <ArrowRightLeft className="w-5 h-5" />
                <span>SWAP (Left Key / Space)</span>
              </button>

              <button
                onClick={() => handleDecision(false)}
                className="py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>KEEP (Right Key / Enter)</span>
              </button>
            </div>
          </>
        ) : (
          /* Start / Game Over Modal */
          <div className="space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20">
              <Gamepad2 className="w-10 h-10 text-cyan-400" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {timeLeft === 0 ? 'Simulation Complete!' : 'Ready to Sort?'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                {timeLeft === 0
                  ? `Final score: ${score} points! Can you beat your best of ${highScore}?`
                  : 'Fast sorting decisions build reflex memory for comparison-based algorithms. Press start to begin the 30-second sprint.'}
              </p>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm inline-flex items-center gap-2.5 transition-all hover:scale-105 shadow-xl shadow-cyan-500/30"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{timeLeft === 0 ? 'Play Again' : 'Start Sort Rush'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
