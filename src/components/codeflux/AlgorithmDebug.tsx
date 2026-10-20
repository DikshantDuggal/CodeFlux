import React, { useState, useEffect, useRef } from 'react';
import {
  Bug,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Code2,
  Sparkles,
  HelpCircle,
  Terminal,
  Trophy,
  Flame,
  Check,
  ChevronRight,
  RefreshCw,
  Eye,
  Sliders,
} from 'lucide-react';

interface DebugChallenge {
  id: string;
  title: string;
  algorithm: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  symptom: string;
  initialArray: number[];
  codeLines: string[];
  buggyLineIndex: number;
  buggyExplanation: string;
  invariantViolated: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  // Step simulation generator for buggy run
  generateBuggySteps: (arr: number[]) => {
    array: number[];
    comparing: [number, number] | null;
    swapping: [number, number] | null;
    activeLine: number;
    description: string;
  }[];
  // Correct step generator
  generateCorrectSteps: (arr: number[]) => number[];
}

const DEBUG_CHALLENGES: DebugChallenge[] = [
  {
    id: 'bubble-off-by-one',
    title: 'The Marooned Suffix (Off-by-One Bound)',
    algorithm: 'Bubble Sort',
    difficulty: 'Easy',
    description:
      'A developer attempted to optimize Bubble Sort by reducing the inner loop bound, but the loop terminates one comparison too early on every pass.',
    symptom:
      'The largest unsorted element fails to reach its rightful spot at the end of each pass. The final two adjacent elements are never compared!',
    initialArray: [52, 41, 33, 20, 12],
    codeLines: [
      'function bubbleSort(arr) {',
      '  const n = arr.length;',
      '  for (let i = 0; i < n; i++) {',
      '    // Loop bound check:',
      '    for (let j = 0; j < n - i - 2; j++) { // ⚠️ FAULTY LINE',
      '      if (arr[j] > arr[j + 1]) {',
      '        swap(arr, j, j + 1);',
      '      }',
      '    }',
      '  }',
      '  return arr;',
      '}',
    ],
    buggyLineIndex: 4,
    buggyExplanation:
      'Loop condition `j < n - i - 2` terminates when `j = n - i - 3`. It never compares index `n - i - 2` with `n - i - 1`. The correct bound must be `j < n - i - 1`!',
    invariantViolated:
      'Loop Invariant Violated: After pass `i`, the largest `i + 1` elements must be in their final sorted positions `[n - 1 - i .. n - 1]`. Skipping the last pair breaks this guarantee.',
    options: [
      {
        text: 'for (let j = 0; j < n - i - 1; j++)',
        isCorrect: true,
        explanation: 'Correct! This ensures the rightmost unsorted pair is always compared on every pass.',
      },
      {
        text: 'for (let j = 0; j <= n - i - 2; j++)',
        isCorrect: false,
        explanation: 'While this compares one more element, standard idiom uses `j < n - i - 1` and `<= n - i - 2` is fragile for edge cases.',
      },
      {
        text: 'for (let j = 1; j < n - i; j++)',
        isCorrect: false,
        explanation: 'Starting at `j = 1` skips checking the very first index pair `arr[0]` and `arr[1]`.',
      },
      {
        text: 'for (let j = 0; j < n; j++)',
        isCorrect: false,
        explanation: 'This checks out of bounds on the final iteration because `arr[j + 1]` becomes `arr[n]` (undefined).',
      },
    ],
    generateBuggySteps: (initial) => {
      const arr = [...initial];
      const steps = [];
      const n = arr.length;
      steps.push({
        array: [...arr],
        comparing: null,
        swapping: null,
        activeLine: 2,
        description: 'Initialize outer loop i = 0',
      });
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 2; j++) {
          steps.push({
            array: [...arr],
            comparing: [j, j + 1] as [number, number],
            swapping: null,
            activeLine: 5,
            description: `Comparing arr[${j}] (${arr[j]}) with arr[${j + 1}] (${arr[j + 1]})`,
          });
          if (arr[j] > arr[j + 1]) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            steps.push({
              array: [...arr],
              comparing: null,
              swapping: [j, j + 1] as [number, number],
              activeLine: 6,
              description: `Swapped arr[${j}] and arr[${j + 1}]`,
            });
          }
        }
      }
      return steps;
    },
    generateCorrectSteps: (initial) => {
      return [...initial].sort((a, b) => a - b);
    },
  },
  {
    id: 'selection-inverted-comparator',
    title: 'The Inverted Extremum (Comparator Inversion)',
    algorithm: 'Selection Sort',
    difficulty: 'Medium',
    description:
      'A student implemented Selection Sort intending to sort ascending, but inverted the inner comparator condition.',
    symptom:
      'Instead of selecting the minimum element to move to the sorted boundary, the maximum element is selected, sorting in reverse descending order!',
    initialArray: [18, 45, 12, 64, 29],
    codeLines: [
      'function selectionSort(arr) {',
      '  const n = arr.length;',
      '  for (let i = 0; i < n - 1; i++) {',
      '    let targetIdx = i;',
      '    for (let j = i + 1; j < n; j++) {',
      '      // ⚠️ FAULTY COMPARATOR: should find minimum, not maximum!',
      '      if (arr[j] > arr[targetIdx]) {',
      '        targetIdx = j;',
      '      }',
      '    }',
      '    swap(arr, i, targetIdx);',
      '  }',
      '  return arr;',
      '}',
    ],
    buggyLineIndex: 6,
    buggyExplanation:
      'The condition `arr[j] > arr[targetIdx]` seeks the MAXIMUM element in the remaining unsorted subarray rather than the MINIMUM. It must be `arr[j] < arr[targetIdx]`.',
    invariantViolated:
      'Loop Invariant Violated: At step `i`, `arr[0..i-1]` must contain the smallest `i` elements in sorted order. Here it contains the largest elements.',
    options: [
      {
        text: 'if (arr[j] < arr[targetIdx])',
        isCorrect: true,
        explanation: 'Correct! This locates the true minimum in the unsorted suffix.',
      },
      {
        text: 'if (arr[j] <= arr[i])',
        isCorrect: false,
        explanation: 'Comparing directly against `arr[i]` instead of the dynamically tracked `targetIdx` fails when a new minimum is found.',
      },
      {
        text: 'if (arr[targetIdx] > arr[i])',
        isCorrect: false,
        explanation: 'This comparison ignores candidate `j` entirely.',
      },
      {
        text: 'if (arr[j] == arr[targetIdx])',
        isCorrect: false,
        explanation: 'Equality check will never find non-identical extrema.',
      },
    ],
    generateBuggySteps: (initial) => {
      const arr = [...initial];
      const steps = [];
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        let maxIdx = i;
        for (let j = i + 1; j < n; j++) {
          steps.push({
            array: [...arr],
            comparing: [j, maxIdx] as [number, number],
            swapping: null,
            activeLine: 6,
            description: `Comparing arr[${j}] with current max arr[${maxIdx}]`,
          });
          if (arr[j] > arr[maxIdx]) {
            maxIdx = j;
          }
        }
        if (maxIdx !== i) {
          const temp = arr[i];
          arr[i] = arr[maxIdx];
          arr[maxIdx] = temp;
          steps.push({
            array: [...arr],
            comparing: null,
            swapping: [i, maxIdx] as [number, number],
            activeLine: 10,
            description: `Swapped max element (${arr[i]}) into position ${i}`,
          });
        }
      }
      return steps;
    },
    generateCorrectSteps: (initial) => {
      return [...initial].sort((a, b) => a - b);
    },
  },
  {
    id: 'insertion-underflow-zero',
    title: 'The Head Blindspot (Strict Inequality)',
    algorithm: 'Insertion Sort',
    difficulty: 'Medium',
    description:
      'The while-loop in Insertion Sort shifts elements to make room for `key`. A strict inequality stops shifting prematurely.',
    symptom:
      'The smallest elements never shift into index 0! Any element smaller than `arr[0]` gets stuck at index 1.',
    initialArray: [35, 24, 18, 9, 4],
    codeLines: [
      'function insertionSort(arr) {',
      '  for (let i = 1; i < arr.length; i++) {',
      '    const key = arr[i];',
      '    let j = i - 1;',
      '    // ⚠️ FAULTY WHILE CONDITION: strict inequality skips index 0!',
      '    while (j > 0 && arr[j] > key) {',
      '      arr[j + 1] = arr[j];',
      '      j--;',
      '    }',
      '    arr[j + 1] = key;',
      '  }',
      '  return arr;',
      '}',
    ],
    buggyLineIndex: 5,
    buggyExplanation:
      'When `j` reaches 0, the check `j > 0` evaluates to `false`. Therefore `arr[0]` is never compared against `key` or shifted right. The condition must be `j >= 0`.',
    invariantViolated:
      'Loop Invariant Violated: `arr[0..i]` must be a sorted permutation of the initial subarray. Bypassing index 0 leaves `arr[0]` stranded as an unsorted sentinel.',
    options: [
      {
        text: 'while (j >= 0 && arr[j] > key)',
        isCorrect: true,
        explanation: 'Correct! Permitting `j = 0` allows elements to shift right so the key can occupy index 0 if it is the new minimum.',
      },
      {
        text: 'while (j > -1 || arr[j] > key)',
        isCorrect: false,
        explanation: 'Using OR (`||`) causes the loop to continue even if elements are already in order, corrupting the prefix.',
      },
      {
        text: 'while (j !== 0 && arr[j] > key)',
        isCorrect: false,
        explanation: '`j !== 0` causes index out-of-bounds error when `j` decrements to `-1`.',
      },
      {
        text: 'while (j > 1 && arr[j] > key)',
        isCorrect: false,
        explanation: 'This worsens the issue by also skipping index 1.',
      },
    ],
    generateBuggySteps: (initial) => {
      const arr = [...initial];
      const steps = [];
      for (let i = 1; i < arr.length; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j > 0 && arr[j] > key) {
          arr[j + 1] = arr[j];
          steps.push({
            array: [...arr],
            comparing: [j, j + 1] as [number, number],
            swapping: null,
            activeLine: 6,
            description: `Shifted arr[${j}] (${arr[j]}) rightwards`,
          });
          j--;
        }
        arr[j + 1] = key;
        steps.push({
          array: [...arr],
          comparing: null,
          swapping: [j + 1, i] as [number, number],
          activeLine: 9,
          description: `Inserted key (${key}) at position ${j + 1}`,
        });
      }
      return steps;
    },
    generateCorrectSteps: (initial) => {
      return [...initial].sort((a, b) => a - b);
    },
  },
  {
    id: 'quicksort-pivot-trap',
    title: 'The Pivot Inclusion Trap (Infinite Recursion)',
    algorithm: 'Quick Sort',
    difficulty: 'Hard',
    description:
      'After partitioning around pivot index `p`, the recursive subproblems are defined. Including the pivot in the left partition triggers infinite recursion on already-sorted arrays!',
    symptom:
      'When the pivot is the largest element, `p` equals `high`. The subproblem `(low, p)` has identical size to `(low, high)`, causing Maximum Call Stack Exceeded!',
    initialArray: [10, 20, 30, 40, 50],
    codeLines: [
      'function quickSort(arr, low, high) {',
      '  if (low < high) {',
      '    const p = partition(arr, low, high);',
      '    // ⚠️ FAULTY RECURSIVE SUBPROBLEM:',
      '    quickSort(arr, low, p); // Pivot p is redundantly included!',
      '    quickSort(arr, p + 1, high);',
      '  }',
      '}',
    ],
    buggyLineIndex: 4,
    buggyExplanation:
      'The partition routine places the pivot at index `p` in its final sorted position. Including `p` in `quickSort(arr, low, p)` fails to decrease problem size when `p === high`. It must be `p - 1`!',
    invariantViolated:
      'Divide and Conquer Invariant: Subproblems must strictly decrease in size ($|S_{left}| < |S|$). Including the settled pivot violates strict progress.',
    options: [
      {
        text: 'quickSort(arr, low, p - 1);',
        isCorrect: true,
        explanation: 'Correct! The pivot at index p is already at its globally sorted location and must be excluded from both subproblems.',
      },
      {
        text: 'quickSort(arr, low + 1, p);',
        isCorrect: false,
        explanation: 'Skipping `low` corrupts elements in the left subarray.',
      },
      {
        text: 'quickSort(arr, 0, p);',
        isCorrect: false,
        explanation: 'Hardcoding 0 breaks recursion for right-hand partitions.',
      },
      {
        text: 'quickSort(arr, low, p + 1);',
        isCorrect: false,
        explanation: 'Includes both the pivot and an element from the right partition.',
      },
    ],
    generateBuggySteps: (initial) => {
      const arr = [...initial];
      // Demonstrate recursive stack trap simulation
      return [
        {
          array: [...arr],
          comparing: null,
          swapping: null,
          activeLine: 2,
          description: 'Call quickSort(arr, low=0, high=4). Pivot chosen: 50 at index 4.',
        },
        {
          array: [...arr],
          comparing: [3, 4],
          swapping: null,
          activeLine: 3,
          description: 'Partition returns p = 4 (pivot is already in last position).',
        },
        {
          array: [...arr],
          comparing: [0, 4],
          swapping: null,
          activeLine: 4,
          description: 'Invoking buggy subcall quickSort(arr, 0, 4) with UNCHANGED bounds!',
        },
        {
          array: [...arr],
          comparing: [0, 4],
          swapping: null,
          activeLine: 4,
          description: '⚠️ Infinite Loop Alert: Problem size is still 5! Stack overflow imminent.',
        },
      ];
    },
    generateCorrectSteps: (initial) => {
      return [...initial].sort((a, b) => a - b);
    },
  },
];

export const AlgorithmDebug: React.FC = () => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(DEBUG_CHALLENGES[0].id);
  const challenge = DEBUG_CHALLENGES.find((c) => c.id === selectedChallengeId) || DEBUG_CHALLENGES[0];

  // Execution State
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(600);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Diagnosis State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [solvedChallenges, setSolvedChallenges] = useState<Set<string>>(new Set());

  // Initialize steps when challenge changes
  useEffect(() => {
    const generated = challenge.generateBuggySteps(challenge.initialArray);
    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [challenge]);

  // Handle Playback
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, playbackSpeed);
    }
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, playbackSpeed]);

  const currentStep = steps[currentStepIndex] || {
    array: challenge.initialArray,
    comparing: null,
    swapping: null,
    activeLine: challenge.buggyLineIndex,
    description: 'Ready to debug',
  };

  const finalBuggyArray = steps.length > 0 ? steps[steps.length - 1].array : challenge.initialArray;
  const correctArray = challenge.generateCorrectSteps(challenge.initialArray);

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitFix = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    const chosen = challenge.options[selectedOption];
    if (chosen.isCorrect) {
      setScore((prev) => prev + 100);
      setSolvedChallenges((prev) => new Set([...prev, challenge.id]));
    }
  };

  const maxVal = Math.max(...challenge.initialArray, 1);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-[#0a0f26]/80 border border-rose-800/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-300 shadow-inner">
              <Bug className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold">
                Interactive CS Forensics
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Algorithm Debugging Mode
              </h1>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Spot faulty loop bounds, inverted comparators, and recursive hazards. Inspect step snapshots, diagnose the
            broken invariant, and submit the corrective code patch.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-2xl p-3 sm:p-4 self-start md:self-auto">
          <div className="text-center px-2 border-r border-white/10">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Solved</div>
            <div className="text-lg font-extrabold text-cyan-300 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {solvedChallenges.size}/{DEBUG_CHALLENGES.length}
              </span>
            </div>
          </div>
          <div className="text-center px-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Debug Score</div>
            <div className="text-lg font-extrabold text-amber-300 flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{score} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Selector Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {DEBUG_CHALLENGES.map((c) => {
          const isSolved = solvedChallenges.has(c.id);
          const isSelected = c.id === challenge.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedChallengeId(c.id)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-rose-500/20 border-rose-500/60 text-white shadow-lg shadow-rose-950/50'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {isSolved ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Bug className="w-4 h-4 text-rose-400" />
              )}
              <span>{c.title}</span>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ${
                  c.difficulty === 'Easy'
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                    : c.difficulty === 'Medium'
                    ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                    : 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                }`}
              >
                {c.difficulty}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Forensic Grid: Visualizer & Anomaly Detector on Left, Code Inspector & Fixer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Step Execution & Diff Output */}
        <div className="lg:col-span-7 space-y-6">
          {/* Visual Execution Canvas */}
          <div className="rounded-3xl bg-[#090d1f]/90 border border-white/10 p-6 space-y-5 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">Target Algorithm</span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{challenge.algorithm}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/50">
                    Defective Build
                  </span>
                </h3>
              </div>

              {/* Step indicator */}
              <div className="text-xs font-mono text-slate-400">
                Step {currentStepIndex + 1} of {steps.length}
              </div>
            </div>

            {/* Stepper Visualizer Bars */}
            <div className="h-44 sm:h-52 flex items-end justify-center gap-3 sm:gap-5 px-4 pt-4 pb-2 bg-black/40 rounded-2xl border border-white/5 relative">
              {currentStep.array.map((val: number, idx: number) => {
                const isComparing =
                  currentStep.comparing && (currentStep.comparing[0] === idx || currentStep.comparing[1] === idx);
                const isSwapping =
                  currentStep.swapping && (currentStep.swapping[0] === idx || currentStep.swapping[1] === idx);

                let barColor = 'from-slate-700 to-slate-800 border-slate-600';
                if (isComparing) {
                  barColor = 'from-amber-400 to-amber-600 border-amber-300 animate-pulse';
                }
                if (isSwapping) {
                  barColor = 'from-rose-400 to-rose-600 border-rose-300';
                }

                const heightPercent = Math.max(15, Math.round((val / maxVal) * 100));

                return (
                  <div key={idx} className="flex-1 max-w-[64px] flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[11px] font-mono font-bold text-white">{val}</span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-xl bg-gradient-to-t ${barColor} border-t border-x transition-all duration-200 shadow-lg`}
                    />
                    <span className="text-[10px] font-mono text-slate-400">[{idx}]</span>
                  </div>
                );
              })}
            </div>

            {/* Execution Description */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5 text-xs text-slate-200 font-mono">
              <Terminal className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="truncate">{currentStep.description}</span>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors shadow-md shadow-cyan-500/20"
                >
                  <Play className={`w-3.5 h-3.5 ${isPlaying ? 'fill-black' : ''}`} />
                  <span>{isPlaying ? 'Pause' : 'Run Buggy Code'}</span>
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex(0);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                  title="Reset Steps"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={currentStepIndex >= steps.length - 1}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
                  }}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-200 border border-white/10 text-xs font-mono"
                >
                  Step Next →
                </button>
              </div>

              {/* Speed Controller */}
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>Speed:</span>
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none"
                >
                  <option value={1000}>0.5x</option>
                  <option value={600}>1.0x</option>
                  <option value={250}>2.0x</option>
                </select>
              </div>
            </div>
          </div>

          {/* Anomaly Diff Inspector (Expected vs Actual) */}
          <div className="rounded-3xl bg-[#090d1f]/90 border border-white/10 p-6 space-y-4 backdrop-blur-xl">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Eye className="w-4 h-4 text-rose-400" />
              <span>Anomaly Detection (Actual vs Expected)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              {/* Actual Buggy Output */}
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-2">
                <div className="flex items-center justify-between text-rose-300 font-bold">
                  <span>❌ Buggy Output:</span>
                  <span className="text-[10px] uppercase">Unsorted Elements</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {finalBuggyArray.map((val: number, i: number) => {
                    const isMismatched = val !== correctArray[i];
                    return (
                      <span
                        key={i}
                        className={`px-2 py-1 rounded-lg border font-bold ${
                          isMismatched
                            ? 'bg-rose-500/30 text-rose-200 border-rose-400 animate-pulse'
                            : 'bg-white/5 text-slate-300 border-white/10'
                        }`}
                      >
                        {val}
                      </span>
                    );
                  })}
                </div>
                <p className="text-[11px] text-rose-200/80 pt-1 leading-relaxed">
                  Notice: Highlighted entries violated sorted order due to missing steps or inverted conditions.
                </p>
              </div>

              {/* Expected Sorted Output */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span>✅ Expected Target:</span>
                  <span className="text-[10px] uppercase">Strictly Ascending</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {correctArray.map((val: number, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-bold"
                    >
                      {val}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-emerald-200/80 pt-1 leading-relaxed">
                  Goal: Identify the faulty condition in the code that caused this drift.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Inspector & Patch Selection */}
        <div className="lg:col-span-5 space-y-6">
          {/* Code Inspector with Active Line Highlight */}
          <div className="rounded-3xl bg-[#070b1b]/95 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-200">Defective Source Code</span>
              </div>
              <span className="text-[10px] font-mono text-rose-400 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800/50">
                1 Bug Found
              </span>
            </div>

            <div className="p-4 font-mono text-xs overflow-x-auto space-y-1">
              {challenge.codeLines.map((line, idx) => {
                const isBuggyLine = idx === challenge.buggyLineIndex;
                const isCurrentExecutingLine = idx === currentStep.activeLine;

                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 px-2 py-1 rounded-md transition-colors ${
                      isBuggyLine
                        ? 'bg-rose-500/20 border-l-2 border-rose-400 text-rose-200'
                        : isCurrentExecutingLine
                        ? 'bg-cyan-500/10 border-l-2 border-cyan-400 text-cyan-200'
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="w-5 text-right select-none opacity-40 text-[10px] mt-0.5">{idx + 1}</span>
                    <pre className="font-mono text-xs">{line}</pre>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Diagnosis & Patch Submission */}
          <div className="rounded-3xl bg-[#090d1f]/90 border border-white/10 p-6 space-y-5 backdrop-blur-xl shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Step 2: Propose The Patch</span>
              <h4 className="text-sm font-bold text-white">How should line {challenge.buggyLineIndex + 1} be corrected?</h4>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {challenge.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                let optionStyle = 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white';

                if (isSelected) {
                  optionStyle = 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-950/50';
                }

                if (isSubmitted) {
                  if (opt.isCorrect) {
                    optionStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200';
                  } else if (isSelected && !opt.isCorrect) {
                    optionStyle = 'bg-rose-500/20 border-rose-400 text-rose-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs font-mono transition-all flex items-start gap-3 ${optionStyle}`}
                  >
                    <span className="w-5 h-5 rounded-lg border border-white/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px]">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 break-all">{opt.text}</span>
                    {isSubmitted && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    {isSubmitted && isSelected && !opt.isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Submit or Reset Button */}
            {!isSubmitted ? (
              <button
                disabled={selectedOption === null}
                onClick={handleSubmitFix}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-30 text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20"
              >
                Verify & Apply Patch
              </button>
            ) : (
              <div className="space-y-3 pt-2">
                <div
                  className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    challenge.options[selectedOption!].isCorrect
                      ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-700/60 text-rose-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {challenge.options[selectedOption!].isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Patch Verified! Invariant Restored (+100 pts)</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                        <span>Patch Failed Verification</span>
                      </>
                    )}
                  </div>
                  <p className="leading-relaxed text-[11px] opacity-90">
                    {challenge.options[selectedOption!].explanation}
                  </p>
                </div>

                {/* Educational Breakdown */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-2">
                  <div className="font-bold text-cyan-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Loop Invariant Deep Dive</span>
                  </div>
                  <p className="text-[11px] text-slate-300/90 leading-relaxed font-sans">
                    {challenge.invariantViolated}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedOption(null);
                    setIsSubmitted(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Diagnostic</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
