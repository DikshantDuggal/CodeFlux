import React, { useState, useMemo } from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  Flame,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  Zap,
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  category: 'Time Complexity' | 'Space Complexity' | 'Stability' | 'Theory';
  algorithm: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  recurrence?: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Time Complexity',
    algorithm: 'Quick Sort',
    question: 'What is the WORST-CASE time complexity of Quick Sort, and when does it occur?',
    options: [
      'O(N log N) — occurs when elements are uniformly distributed',
      'O(N²) — occurs when the pivot is consistently the smallest or largest element',
      'O(N) — occurs when the array is already sorted',
      'O(N log² N) — occurs on recursive partition exhaustion',
    ],
    correctIndex: 1,
    explanation:
      'When the selected pivot is always the extreme element (such as choosing the first element of an already-sorted array), the partitions become highly unbalanced (sizes 0 and N-1). This results in N recursive calls each taking O(N) work, yielding O(N²). Randomized pivot or median-of-three solves this issue in practice.',
    recurrence: 'T(N) = T(N-1) + O(N)  ⟹  O(N²)',
  },
  {
    id: 2,
    category: 'Space Complexity',
    algorithm: 'Merge Sort',
    question: 'What is the auxiliary space complexity of standard standard Merge Sort on an array?',
    options: [
      'O(1) — Merge Sort sorts entirely in-place without memory allocation',
      'O(log N) — only requires stack frames for recursion',
      'O(N) — requires auxiliary arrays to copy and merge subarrays',
      'O(N²) — copies the full matrix across all subdivision levels',
    ],
    correctIndex: 2,
    explanation:
      'During the merge phase, standard array-based Merge Sort requires a temporary buffer of size N to copy and recombine the two sorted halves. While linked-list Merge Sort can be O(1) extra space, array Merge Sort is strictly O(N) auxiliary space.',
    recurrence: 'Auxiliary Buffer: O(N) + Stack: O(log N)  ⟹  O(N)',
  },
  {
    id: 3,
    category: 'Time Complexity',
    algorithm: 'Insertion Sort',
    question: 'What is the BEST-CASE time complexity of Insertion Sort with an early break?',
    options: [
      'O(N²) comparisons and swaps',
      'O(N) comparisons and 0 swaps',
      'O(N log N) using binary search insertion',
      'O(1) constant time regardless of array size',
    ],
    correctIndex: 1,
    explanation:
      'If the array is already sorted, each element only needs to be compared once against its immediate left predecessor (arr[i] >= arr[i-1]). The inner loop terminates immediately without any shifting, performing exactly N-1 comparisons and 0 swaps, yielding optimal linear O(N) performance.',
    recurrence: 'Loop runs N-1 times with 1 comparison each: O(N)',
  },
  {
    id: 4,
    category: 'Stability',
    algorithm: 'Selection Sort',
    question: 'Is standard Selection Sort stable? Why or why not?',
    options: [
      'Yes, because it always selects the minimum element in order',
      'No, because long-distance swaps can move an element past duplicate keys',
      'Yes, as long as it operates in-place',
      'No, because it requires O(N) auxiliary space',
    ],
    correctIndex: 1,
    explanation:
      'Selection Sort is NOT stable in its standard swap-based form. For example, in the array [4a, 4b, 1], finding the minimum (1) and swapping it with index 0 produces [1, 4b, 4a]. Notice that 4a was jumped over 4b, reversing their relative order!',
  },
  {
    id: 5,
    category: 'Time Complexity',
    algorithm: 'Selection Sort',
    question: 'How many comparisons does Selection Sort perform on an ALREADY SORTED array of size N?',
    options: [
      'N - 1 comparisons (linear best case)',
      'N(N - 1) / 2 comparisons (always quadratic)',
      '0 comparisons (skips check)',
      'N log N comparisons',
    ],
    correctIndex: 1,
    explanation:
      'Unlike Bubble Sort or Insertion Sort, Selection Sort has no early-exit condition! It must scan the entire unsorted subarray to guarantee that no smaller element exists. Thus it always executes (N-1) + (N-2) + ... + 1 = N(N-1)/2 comparisons, even when the input is already perfectly sorted.',
    recurrence: 'Sum_{i=1}^{N-1} i = N(N-1)/2  ⟹  O(N²)',
  },
  {
    id: 6,
    category: 'Theory',
    algorithm: 'Comparison-Based Sorting',
    question: 'What is the theoretical lower bound on comparisons for ANY comparison-based sorting algorithm?',
    options: [
      'Ω(N) comparisons',
      'Ω(N log N) comparisons',
      'Ω(N²) comparisons',
      'Ω(log N) comparisons',
    ],
    correctIndex: 1,
    explanation:
      'A comparison-based sort can be represented as a decision tree with N! possible permutations at the leaves. A binary tree with N! leaves must have a minimum depth of log2(N!) = Ω(N log N) via Stirling’s approximation. Hence, no comparison sort can beat O(N log N) worst-case.',
    recurrence: 'log2(N!) ≈ N log2(N) - N log2(e) = Ω(N log N)',
  },
  {
    id: 7,
    category: 'Space Complexity',
    algorithm: 'Quick Sort',
    question: 'What is the best/average call-stack space complexity of in-place Quick Sort?',
    options: [
      'O(1) stack space',
      'O(log N) stack frames',
      'O(N) stack frames',
      'O(N log N) stack frames',
    ],
    correctIndex: 1,
    explanation:
      'Although Quick Sort sorts elements in-place with O(1) auxiliary data memory, recursion creates call-stack frames. With balanced partitioning, the recursion tree has a depth of O(log N). (If tail-call optimization is applied to the smaller partition first, worst-case stack space is also bounded by O(log N)).',
  },
];

export const ComplexityQuiz: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const filteredQuestions = useMemo(() => {
    if (selectedFilter === 'All') return QUIZ_QUESTIONS;
    return QUIZ_QUESTIONS.filter((q) => q.category === selectedFilter);
  }, [selectedFilter]);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];
  const isCorrect = selectedOption === currentQ.correctIndex;

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    if (isCorrect) {
      const bonus = streak >= 2 ? 150 : 100;
      setScore((prev) => prev + bonus);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/40 border border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-800/60 text-purple-300 text-xs font-mono mb-2 shadow-sm">
              <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
              <span>Big O Algorithmic Masterclass</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Complexity Mastery Quiz
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Challenge your algorithmic intuition: predict Time & Space Big-O bounds and stability invariants.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-3">
            <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Score</span>
              <span className="text-xl font-bold font-mono text-cyan-300">{score} pts</span>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center">
              <div className="flex items-center justify-center gap-1">
                <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-500'}`} />
                <span className="text-[10px] font-mono uppercase text-slate-400">Streak</span>
              </div>
              <span className="text-xl font-bold font-mono text-amber-300">{streak}</span>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-white/10">
          <span className="text-xs font-mono text-slate-400 mr-2">Category:</span>
          {['All', 'Time Complexity', 'Space Complexity', 'Stability', 'Theory'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedFilter(cat);
                setCurrentIndex(0);
                setSelectedOption(null);
                setIsSubmitted(false);
                setIsFinished(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all border ${
                selectedFilter === cat
                  ? 'bg-purple-600/30 text-purple-300 border-purple-500/50 shadow-sm'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Question Card or Victory Screen */}
      {!isFinished ? (
        <div className="bg-slate-900/50 border border-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-white/10 pb-4">
            <span className="text-cyan-400 font-semibold">
              Question {currentIndex + 1} of {filteredQuestions.length}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
              {currentQ.algorithm} • {currentQ.category}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
            {currentQ.question}
          </h2>

          {/* Recurrence hint if available */}
          {currentQ.recurrence && (
            <div className="bg-[#080d1a] border border-cyan-800/40 rounded-xl p-3 text-xs font-mono text-cyan-300">
              <span className="text-slate-400 mr-2">Mathematical Invariant:</span>
              <code>{currentQ.recurrence}</code>
            </div>
          )}

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnClass = 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10';

              if (isSelected && !isSubmitted) {
                btnClass = 'bg-cyan-500/20 border-cyan-400/80 text-white ring-1 ring-cyan-400';
              } else if (isSubmitted) {
                if (idx === currentQ.correctIndex) {
                  btnClass = 'bg-emerald-500/25 border-emerald-400 text-emerald-200 font-semibold';
                } else if (isSelected && !isCorrect) {
                  btnClass = 'bg-rose-500/25 border-rose-400 text-rose-200';
                } else {
                  btnClass = 'bg-white/5 border-white/5 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isSubmitted}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3.5 ${btnClass}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center font-mono text-xs flex-shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                  {isSubmitted && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                  {isSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout after submission */}
          {isSubmitted && (
            <div
              className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed transition-all ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1.5 font-mono">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Correct Reasoning! (+{streak >= 2 ? '150' : '100'} pts)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Incorrect Intuition — Let's Learn:</span>
                  </>
                )}
              </div>
              <p className="text-slate-300">{currentQ.explanation}</p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-xs font-mono text-slate-500">
              Select an option to verify intuition
            </span>

            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-bold text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/20"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-purple-500/25"
              >
                <span>{currentIndex + 1 < filteredQuestions.length ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Victory / Results Card */
        <div className="bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
            <Trophy className="w-8 h-8 text-purple-400" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Quiz Completed!</h2>
            <p className="text-slate-300 text-sm mt-1">
              You scored <b className="text-cyan-300">{score} points</b> across {filteredQuestions.length} algorithmic challenges.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-left">
            <div className="bg-black/40 border border-white/10 p-3.5 rounded-xl">
              <span className="text-[10px] font-mono text-slate-400 block">Max Streak</span>
              <span className="text-xl font-bold font-mono text-amber-300">{streak} in a row</span>
            </div>
            <div className="bg-black/40 border border-white/10 p-3.5 rounded-xl">
              <span className="text-[10px] font-mono text-slate-400 block">Mastery Level</span>
              <span className="text-xl font-bold font-mono text-emerald-300">
                {score >= 500 ? 'Expert' : score >= 300 ? 'Proficient' : 'Apprentice'}
              </span>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm inline-flex items-center gap-2 transition-all shadow-xl shadow-cyan-500/25"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Complexity Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
};
