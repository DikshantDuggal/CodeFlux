import React, { useState, useMemo } from 'react';
import {
  Layers,
  Cpu,
  Database,
  BarChart3,
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Code2,
  Sliders,
  TrendingUp,
  FileCode2,
  Copy,
  Check,
} from 'lucide-react';

interface TechItem {
  id: string;
  name: string;
  category: string;
  percentage: number;
  color: string;
  gradient: string;
  description: string;
  role: string;
  files: string[];
  specs: string[];
}

const TECH_STACK: TechItem[] = [
  {
    id: 'react',
    name: 'React 19 & TypeScript',
    category: 'Frontend & Interactive Dashboard',
    percentage: 35,
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-blue-500',
    description:
      'Powers the real-time interactive laboratory dashboard, visualizer canvas, dual-algorithm synchronized race engine, and prediction quiz flow.',
    role: 'Client-side rendering, sub-millisecond step-scrubbing, accessible ARIA state, and dynamic bar visualizers.',
    files: ['src/App.tsx', 'src/components/codeflux/AlgorithmLab.tsx', 'src/components/codeflux/AlgorithmRace.tsx'],
    specs: ['React 19 + TypeScript', 'Tailwind CSS v4 Engine', 'Lucide React Icons', 'Zero WebGL Overhead'],
  },
  {
    id: 'python',
    name: 'Python 3.12 & FastAPI',
    category: 'Core Algorithmic Engine & API',
    percentage: 30,
    color: '#3b82f6',
    gradient: 'from-blue-500 to-indigo-600',
    description:
      'The foundational computational engine that generates snapshots, state diffs, comparisons, swaps, and line-synchronized step events.',
    role: 'Server-side step generation, algorithmic proofs, micro-benchmarks, and REST API endpoints for /sort and /race.',
    files: ['backend/algorithms.py', 'backend/main.py', 'backend/requirements.txt'],
    specs: ['FastAPI REST API', 'Uvicorn ASGI Server', 'Pydantic V2 Models', 'Pure Snapshot Array Copies'],
  },
  {
    id: 'postgres',
    name: 'PostgreSQL Relational Storage',
    category: 'Persistent Telemetry & Runs DB',
    percentage: 15,
    color: '#6366f1',
    gradient: 'from-indigo-500 to-purple-600',
    description:
      'Stores empirical benchmark runs, user prediction scores, and historical time/space performance metrics for deep comparative analysis.',
    role: 'Relational data persistence, aggregation queries (AVG/MEDIAN operation counts per array size), and multi-trial telemetry.',
    files: ['database/schema.sql', 'database/queries.py'],
    specs: ['PostgreSQL 16 Engine', 'Indexed run_id and algorithm_name', 'JSONB Step Snapshot Storage', 'ACID Transactions'],
  },
  {
    id: 'streamlit',
    name: 'Streamlit Workbench',
    category: 'Scientific Lab & Exploratory UI',
    percentage: 10,
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-600',
    description:
      'Provides an exploratory data science workbench where instructors and researchers can test distribution hypotheses and tune parameters.',
    role: 'Rapid prototyping UI for Monte-Carlo array experiments, distribution sliders, and dynamic chart triggers.',
    files: ['streamlit/app.py', 'streamlit/pages/benchmarks.py'],
    specs: ['Streamlit v1.38', 'Interactive Sliders & Selectors', 'Live Cache (@st.cache_data)', 'One-click run workflows'],
  },
  {
    id: 'seaborn_matplotlib',
    name: 'Seaborn & Matplotlib',
    category: 'Statistical Analytics & Distribution Plots',
    percentage: 10,
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
    description:
      'Renders high-fidelity statistical plots including Kernel Density Estimations (KDE), Quartile Boxplots, and Performance Heatmaps.',
    role: 'Visualizing variance in comparison distributions, outlier detection in QuickSort pivots, and empirical complexity curves.',
    files: ['analysis/seaborn_plots.py', 'analysis/matplotlib_figures.py'],
    specs: ['Seaborn 0.13 Statistical Themes', 'Matplotlib 3.9 Figure Renderer', 'KDE Density Gaussian Kernels', 'Heatmap Color Matrices'],
  },
];

export const TechStackAnalytics: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<string>('react');
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'seaborn' | 'boxplot' | 'heatmap' | 'streamlit' | 'postgres' | 'code'>('seaborn');
  
  // Streamlit Interactive Simulator State
  const [simSampleSize, setSimSampleSize] = useState<number>(30);
  const [simDistribution, setSimDistribution] = useState<'uniform' | 'gaussian' | 'reversed' | 'nearly_sorted'>('gaussian');
  const [simTrials, setSimTrials] = useState<number>(50);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeTechItem = useMemo(() => {
    return TECH_STACK.find((t) => t.id === selectedTech) || TECH_STACK[0];
  }, [selectedTech]);

  // Generate simulated empirical data based on Streamlit parameter inputs
  const empiricalData = useMemo(() => {
    const N = simSampleSize;
    // Calculate realistic comparison counts based on complexity math + noise
    const bubbleMean = simDistribution === 'reversed' ? (N * (N - 1)) / 2 : simDistribution === 'nearly_sorted' ? N * 1.5 : (N * (N - 1)) / 2 * 0.8;
    const selectionMean = (N * (N - 1)) / 2;
    const insertionMean = simDistribution === 'reversed' ? (N * (N - 1)) / 2 : simDistribution === 'nearly_sorted' ? N : (N * (N - 1)) / 4;
    const quickMean = Math.round(N * Math.log2(Math.max(2, N)) * 1.4);
    const mergeMean = Math.round(N * Math.log2(Math.max(2, N)) * 1.15);

    return {
      bubble: { name: 'Bubble Sort', mean: Math.round(bubbleMean), std: Math.max(4, Math.round(bubbleMean * 0.12)), color: '#f59e0b', complexity: 'O(N²)' },
      selection: { name: 'Selection Sort', mean: Math.round(selectionMean), std: Math.max(1, Math.round(selectionMean * 0.02)), color: '#06b6d4', complexity: 'O(N²)' },
      insertion: { name: 'Insertion Sort', mean: Math.round(insertionMean), std: Math.max(3, Math.round(insertionMean * 0.2)), color: '#8b5cf6', complexity: 'O(N²)' },
      quick: { name: 'Quick Sort', mean: Math.round(quickMean), std: Math.max(5, Math.round(quickMean * 0.18)), color: '#ec4899', complexity: 'O(N log N)' },
      merge: { name: 'Merge Sort', mean: Math.round(mergeMean), std: Math.max(2, Math.round(mergeMean * 0.06)), color: '#10b981', complexity: 'O(N log N)' },
    };
  }, [simSampleSize, simDistribution]);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 400);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // SVG Circle / Donut Math
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1527] via-[#101b33] to-[#0d1527] border border-slate-800 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                System Architecture & Telemetry
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                Streamlit + Seaborn + PostgreSQL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              CodeFlux Engineering & Empirical Laboratory
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Explore how CodeFlux unifies an interactive <b>React frontend dashboard</b>, a high-performance <b>Python algorithmic backend</b>, <b>PostgreSQL relational storage</b>, a <b>Streamlit scientific workbench</b>, and publication-grade <b>Seaborn & Matplotlib analytics</b>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#080d1a] border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Total Pipeline Components</div>
                <div className="text-lg font-bold font-mono text-white">5 Integrated Stacks</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Interactive Donut Chart & Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive Circle Donut Graph */}
        <div className="lg:col-span-5 bg-[#0b1120] border border-slate-800/80 rounded-2xl p-6 flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Architecture Composition</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Click segment to inspect</span>
          </div>

          {/* SVG Donut Visualizer */}
          <div className="relative w-64 h-64 flex items-center justify-center my-4">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
              {/* Background Track */}
              <circle
                cx="120"
                cy="120"
                r={radius}
                className="stroke-slate-800/60"
                strokeWidth="28"
                fill="transparent"
              />
              {/* Segments */}
              {TECH_STACK.map((tech) => {
                const strokeDasharray = `${(tech.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                accumulatedPercent += tech.percentage;
                const isSelected = selectedTech === tech.id;

                return (
                  <circle
                    key={tech.id}
                    cx="120"
                    cy="120"
                    r={radius}
                    stroke={tech.color}
                    strokeWidth={isSelected ? '34' : '28'}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    fill="transparent"
                    className="cursor-pointer transition-all duration-300 hover:opacity-100"
                    style={{
                      opacity: isSelected ? 1 : 0.65,
                      filter: isSelected ? `drop-shadow(0 0 8px ${tech.color}80)` : 'none',
                    }}
                    onClick={() => setSelectedTech(tech.id)}
                  />
                );
              })}
            </svg>

            {/* Inner Ring Data Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
              <span className="text-3xl font-extrabold font-mono text-white">
                {activeTechItem.percentage}%
              </span>
              <span className="text-xs font-medium text-slate-300 mt-0.5 line-clamp-1">
                {activeTechItem.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {activeTechItem.category.split('&')[0]}
              </span>
            </div>
          </div>

          {/* Interactive Legend Grid */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
            {TECH_STACK.map((tech) => {
              const isSelected = selectedTech === tech.id;
              return (
                <button
                  key={tech.id}
                  onClick={() => setSelectedTech(tech.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg text-left transition-all border ${
                    isSelected
                      ? 'bg-slate-800/90 border-slate-600 shadow-sm'
                      : 'bg-[#0e1628]/50 border-slate-800/60 hover:bg-slate-800/40 text-slate-400'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tech.color }}
                  />
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-white truncate">{tech.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{tech.percentage}%</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Stack Details Inspector */}
        <div className="lg:col-span-7 bg-[#0b1120] border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activeTechItem.color }}
                  />
                  <h3 className="text-lg font-bold text-white">{activeTechItem.name}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{activeTechItem.category}</p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Weight: {activeTechItem.percentage}%
              </span>
            </div>

            {/* Description & Role */}
            <div className="space-y-3 mt-4 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-[#0f172a] border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">Architecture Function:</span>
                <p className="leading-relaxed text-slate-400">{activeTechItem.description}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#0f172a] border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">Operational Role in CodeFlux:</span>
                <p className="leading-relaxed text-slate-400">{activeTechItem.role}</p>
              </div>
            </div>

            {/* Key Specs Pills */}
            <div className="mt-4">
              <span className="text-[11px] text-slate-400 font-mono block mb-2">Specifications & Modules:</span>
              <div className="flex flex-wrap gap-2">
                {activeTechItem.specs.map((spec, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/80 text-cyan-300 border border-slate-700"
                  >
                    ✓ {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Associated Files */}
          <div className="pt-3 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-500 font-mono block mb-1.5">Source Implementation Paths:</span>
            <div className="flex flex-wrap gap-2">
              {activeTechItem.files.map((file, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-black/40 text-slate-400 border border-slate-800"
                >
                  {file}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Lab Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveAnalysisTab('seaborn')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              activeAnalysisTab === 'seaborn'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Seaborn Density (KDE)</span>
          </button>

          <button
            onClick={() => setActiveAnalysisTab('boxplot')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              activeAnalysisTab === 'boxplot'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Seaborn Boxplot</span>
          </button>

          <button
            onClick={() => setActiveAnalysisTab('heatmap')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              activeAnalysisTab === 'heatmap'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Matplotlib Heatmap</span>
          </button>

          <button
            onClick={() => setActiveAnalysisTab('streamlit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              activeAnalysisTab === 'streamlit'
                ? 'bg-pink-500/15 text-pink-400 border border-pink-500/40 shadow-sm shadow-pink-500/10'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Streamlit Workbench</span>
          </button>

          <button
            onClick={() => setActiveAnalysisTab('postgres')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              activeAnalysisTab === 'postgres'
                ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL Schema & Queries</span>
          </button>

          <button
            onClick={() => setActiveAnalysisTab('code')}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
              activeAnalysisTab === 'code'
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/40 shadow-sm shadow-blue-500/10'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Python Source Code</span>
          </button>
        </div>

        <span className="text-xs font-mono text-slate-500 hidden sm:inline">
          N = {simSampleSize} elements • {simDistribution}
        </span>
      </div>

      {/* TAB 1: Seaborn Kernel Density Estimation (KDE) */}
      {activeAnalysisTab === 'seaborn' && (
        <div className="bg-[#0b1120] border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-base font-bold text-white">
                  Seaborn kdeplot(): Comparison Density Distribution (500 Trials)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Visualizing statistical spread and variance of comparisons for input size N = {simSampleSize} under {simDistribution} distribution.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-500">Kernel:</span>
              <span className="text-emerald-400">gaussian</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-500">bw_method:</span>
              <span className="text-emerald-400">silverman</span>
            </div>
          </div>

          {/* SVG Kernel Density Plot */}
          <div className="relative w-full h-72 bg-[#060a14] border border-slate-800/80 rounded-xl p-4 overflow-hidden flex flex-col justify-between">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-rows-4 grid-cols-6 pointer-events-none opacity-20">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="border-b border-r border-slate-600" />
              ))}
            </div>

            {/* Density Curves Rendered via SVG Curves */}
            <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-quick" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="grad-merge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="grad-bubble" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="grad-selection" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Merge Sort Bell Curve (Leftmost, tightest variance) */}
              <path
                d="M 50,220 Q 140,220 180,50 Q 220,220 310,220 Z"
                fill="url(#grad-merge)"
                stroke="#10b981"
                strokeWidth="2.5"
              />

              {/* Quick Sort Bell Curve (Near Merge, slightly wider variance) */}
              <path
                d="M 90,220 Q 200,220 250,70 Q 300,220 410,220 Z"
                fill="url(#grad-quick)"
                stroke="#ec4899"
                strokeWidth="2.5"
              />

              {/* Insertion Sort (Mid spread) */}
              <path
                d="M 240,220 Q 380,220 450,110 Q 520,220 660,220 Z"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />

              {/* Selection Sort Spike (Deterministic exact N*(N-1)/2 comparisons) */}
              <path
                d="M 590,220 Q 640,220 655,30 Q 670,220 720,220 Z"
                fill="url(#grad-selection)"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />

              {/* Bubble Sort Bell Curve (Far right, high count) */}
              <path
                d="M 520,220 Q 620,220 670,80 Q 720,220 780,220 Z"
                fill="url(#grad-bubble)"
                stroke="#f59e0b"
                strokeWidth="2"
              />
            </svg>

            {/* Axis Labels */}
            <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
              <span>0 Comps (O(1))</span>
              <span>~{Math.round(simSampleSize * 2.5)} (O(N))</span>
              <span>~{Math.round(simSampleSize * Math.log2(simSampleSize))} (O(N log N))</span>
              <span>~{Math.round(Math.pow(simSampleSize, 2) / 2)} (O(N²))</span>
            </div>
          </div>

          {/* Interactive Legend & Statistical Means */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(empiricalData).map(([key, data]) => (
              <div
                key={key}
                className="bg-[#0f172a] p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                  <span className="text-xs font-semibold text-slate-200 truncate">{data.name}</span>
                </div>
                <div className="text-lg font-bold font-mono text-white">
                  μ = {data.mean}
                </div>
                <div className="text-[11px] font-mono text-slate-400 flex justify-between mt-1">
                  <span>σ = ±{data.std}</span>
                  <span className="text-cyan-400">{data.complexity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Seaborn Boxplot (Box & Whisker) */}
      {activeAnalysisTab === 'boxplot' && (
        <div className="bg-[#0b1120] border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <h3 className="text-base font-bold text-white">
                Seaborn boxplot(): Operation Dispersion & Outlier Analysis
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Displays Interquartile Range (IQR Q1-Q3), median lines, and min/max whiskers across 100 benchmark batches.
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(empiricalData).map(([key, data]) => {
              const maxScale = Math.max(10, Math.pow(simSampleSize, 2) / 2);
              const q1Pct = Math.min(90, Math.max(5, ((data.mean - data.std) / maxScale) * 100));
              const medianPct = Math.min(94, Math.max(8, (data.mean / maxScale) * 100));
              const q3Pct = Math.min(98, Math.max(12, ((data.mean + data.std) / maxScale) * 100));
              const whiskerMin = Math.max(2, q1Pct - 6);
              const whiskerMax = Math.min(99, q3Pct + 6);

              return (
                <div key={key} className="bg-[#080d1a] p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                      <span className="text-xs font-semibold text-white">{data.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {data.complexity}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-300">
                      Median: <b className="text-white">{data.mean}</b> ops (IQR: {data.mean - data.std} - {data.mean + data.std})
                    </div>
                  </div>

                  {/* Horizontal Box & Whisker Track */}
                  <div className="relative h-7 w-full bg-[#10182b] rounded-lg overflow-hidden flex items-center px-4">
                    {/* Whisker Line */}
                    <div
                      className="absolute h-0.5 bg-slate-500"
                      style={{
                        left: `${whiskerMin}%`,
                        width: `${whiskerMax - whiskerMin}%`,
                      }}
                    />
                    {/* Left Whisker End Cap */}
                    <div
                      className="absolute h-3 w-0.5 bg-slate-400"
                      style={{ left: `${whiskerMin}%` }}
                    />
                    {/* Right Whisker End Cap */}
                    <div
                      className="absolute h-3 w-0.5 bg-slate-400"
                      style={{ left: `${whiskerMax}%` }}
                    />

                    {/* IQR Box (Q1 to Q3) */}
                    <div
                      className="absolute h-4 rounded border flex items-center justify-center transition-all duration-300"
                      style={{
                        left: `${q1Pct}%`,
                        width: `${Math.max(8, q3Pct - q1Pct)}%`,
                        backgroundColor: `${data.color}25`,
                        borderColor: data.color,
                      }}
                    >
                      {/* Median Divider */}
                      <div
                        className="absolute h-full w-1 bg-white shadow-sm"
                        style={{
                          left: `${((medianPct - q1Pct) / Math.max(1, q3Pct - q1Pct)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Matplotlib Performance Heatmap */}
      {activeAnalysisTab === 'heatmap' && (
        <div className="bg-[#0b1120] border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h3 className="text-base font-bold text-white">
                Matplotlib & Seaborn heatmap(): Efficiency Matrix by Array Topology
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Comparative operations heatmap normalized per element. Dark green/cyan = optimal ($O(N)$), Bright amber/red = high operation overhead ($O(N^2)$).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-3 px-4">Algorithm</th>
                  <th className="py-3 px-4">Random Uniform</th>
                  <th className="py-3 px-4">Already Sorted</th>
                  <th className="py-3 px-4">Reverse Sorted</th>
                  <th className="py-3 px-4">Few Unique / Dups</th>
                  <th className="py-3 px-4">Worst-Case Class</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {[
                  { name: 'Bubble Sort', rand: 82, sort: 12, rev: 99, dups: 74, cls: 'O(N²)' },
                  { name: 'Selection Sort', rand: 88, sort: 88, rev: 88, dups: 88, cls: 'O(N²)' },
                  { name: 'Insertion Sort', rand: 60, sort: 8, rev: 99, dups: 45, cls: 'O(N²)' },
                  { name: 'Quick Sort', rand: 24, sort: 26, rev: 82, dups: 22, cls: 'O(N log N)' },
                  { name: 'Merge Sort', rand: 19, sort: 18, rev: 19, dups: 18, cls: 'O(N log N)' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-semibold text-white">{row.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2.5 py-1 rounded font-bold"
                        style={{
                          backgroundColor: row.rand < 30 ? '#064e3b' : row.rand < 70 ? '#78350f' : '#7f1d1d',
                          color: row.rand < 30 ? '#34d399' : row.rand < 70 ? '#fcd34d' : '#f87171',
                        }}
                      >
                        {row.rand}% load
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2.5 py-1 rounded font-bold"
                        style={{
                          backgroundColor: row.sort < 30 ? '#064e3b' : row.sort < 70 ? '#78350f' : '#7f1d1d',
                          color: row.sort < 30 ? '#34d399' : row.sort < 70 ? '#fcd34d' : '#f87171',
                        }}
                      >
                        {row.sort}% load
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2.5 py-1 rounded font-bold"
                        style={{
                          backgroundColor: row.rev < 30 ? '#064e3b' : row.rev < 70 ? '#78350f' : '#7f1d1d',
                          color: row.rev < 30 ? '#34d399' : row.rev < 70 ? '#fcd34d' : '#f87171',
                        }}
                      >
                        {row.rev}% load
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="px-2.5 py-1 rounded font-bold"
                        style={{
                          backgroundColor: row.dups < 30 ? '#064e3b' : row.dups < 70 ? '#78350f' : '#7f1d1d',
                          color: row.dups < 30 ? '#34d399' : row.dups < 70 ? '#fcd34d' : '#f87171',
                        }}
                      >
                        {row.dups}% load
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{row.cls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Streamlit Interactive Scientific Workbench Simulator */}
      {activeAnalysisTab === 'streamlit' && (
        <div className="bg-[#0b1120] border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
              <div>
                <h3 className="text-base font-bold text-white">
                  Streamlit Workbench — Interactive Hypothesis Tuning
                </h3>
                <p className="text-xs text-slate-400">
                  Simulates a Streamlit live application (<code className="text-pink-400">streamlit run app.py</code>) allowing parameter adjustment in real-time.
                </p>
              </div>
            </div>

            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-medium text-xs flex items-center gap-2 transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50"
            >
              {isSimulating ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isSimulating ? 'Computing Monte Carlo...' : 'Re-run Streamlit Script'}</span>
            </button>
          </div>

          {/* Streamlit Parameter Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#080d1a] p-4 rounded-xl border border-slate-800">
            {/* Array Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-mono">st.slider("Array Size (N)"):</span>
                <span className="font-bold text-pink-400 font-mono">{simSampleSize} elements</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={simSampleSize}
                onChange={(e) => setSimSampleSize(Number(e.target.value))}
                className="w-full accent-pink-500"
              />
              <span className="text-[10px] text-slate-500 block">Tests complexity curve scalability</span>
            </div>

            {/* Distribution Selector */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-mono">st.selectbox("Input Topology"):</span>
                <span className="font-bold text-cyan-400 font-mono capitalize">{simDistribution}</span>
              </div>
              <select
                value={simDistribution}
                onChange={(e) => setSimDistribution(e.target.value as any)}
                className="w-full bg-[#10172a] text-slate-200 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-pink-500"
              >
                <option value="gaussian">Gaussian / Normal Distribution</option>
                <option value="uniform">Uniform Random</option>
                <option value="nearly_sorted">Nearly Sorted (1-2 inversions)</option>
                <option value="reversed">Strictly Reversed (Worst Case)</option>
              </select>
              <span className="text-[10px] text-slate-500 block">Exposes best vs worst case divergence</span>
            </div>

            {/* Monte Carlo Trials */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-mono">st.number_input("Batch Trials"):</span>
                <span className="font-bold text-emerald-400 font-mono">{simTrials} runs</span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                step="20"
                value={simTrials}
                onChange={(e) => setSimTrials(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <span className="text-[10px] text-slate-500 block">Averages random seed variance</span>
            </div>
          </div>

          {/* Streamlit Output Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono block">st.metric("Theoretical N² Max")</span>
              <span className="text-xl font-bold font-mono text-amber-400">
                {Math.round((simSampleSize * (simSampleSize - 1)) / 2)}
              </span>
              <span className="text-[10px] text-slate-500 block">Bubble / Selection worst-case</span>
            </div>
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono block">st.metric("Theoretical N log N")</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                {Math.round(simSampleSize * Math.log2(simSampleSize))}
              </span>
              <span className="text-[10px] text-slate-500 block">Merge / Quick expected average</span>
            </div>
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono block">st.metric("O(N) Linear Lower Bound")</span>
              <span className="text-xl font-bold font-mono text-cyan-400">{simSampleSize}</span>
              <span className="text-[10px] text-slate-500 block">Insertion sort on pre-sorted input</span>
            </div>
            <div className="bg-[#0f172a] p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono block">st.metric("Simulated Speedup Factor")</span>
              <span className="text-xl font-bold font-mono text-pink-400">
                {(((simSampleSize * (simSampleSize - 1)) / 2) / Math.max(1, simSampleSize * Math.log2(simSampleSize))).toFixed(1)}x
              </span>
              <span className="text-[10px] text-slate-500 block">Merge vs Bubble efficiency ratio</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PostgreSQL Database Schema & Relational Telemetry */}
      {activeAnalysisTab === 'postgres' && (
        <div className="bg-[#0b1120] border border-slate-800/80 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  PostgreSQL Relational Storage Engine
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Schema and telemetry queries for recording sorting laboratory runs, operation benchmarks, and prediction streaks.
              </p>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
              PostgreSQL 16
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table DDL */}
            <div className="bg-[#080d1a] rounded-xl border border-slate-800 overflow-hidden">
              <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                <span className="text-xs font-mono text-slate-300">schema.sql — Relational Tables</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `CREATE TABLE experiment_runs (
    id SERIAL PRIMARY KEY,
    algorithm VARCHAR(32) NOT NULL,
    array_size INT NOT NULL,
    distribution VARCHAR(32) NOT NULL,
    comparisons INT NOT NULL,
    swaps INT NOT NULL,
    accesses INT NOT NULL,
    duration_ms NUMERIC(8, 3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE step_snapshots (
    id SERIAL PRIMARY KEY,
    run_id INT REFERENCES experiment_runs(id) ON DELETE CASCADE,
    step_index INT NOT NULL,
    step_type VARCHAR(20) NOT NULL,
    indices JSONB NOT NULL,
    array_state JSONB NOT NULL
);`,
                      'ddl'
                    )
                  }
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedCode === 'ddl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'ddl' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-indigo-200/90 overflow-x-auto leading-relaxed">
{`CREATE TABLE experiment_runs (
    id SERIAL PRIMARY KEY,
    algorithm VARCHAR(32) NOT NULL,
    array_size INT NOT NULL,
    distribution VARCHAR(32) NOT NULL,
    comparisons INT NOT NULL,
    swaps INT NOT NULL,
    accesses INT NOT NULL,
    duration_ms NUMERIC(8, 3) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_runs_algo_size 
ON experiment_runs(algorithm, array_size);

CREATE TABLE step_snapshots (
    id SERIAL PRIMARY KEY,
    run_id INT REFERENCES experiment_runs(id) ON DELETE CASCADE,
    step_index INT NOT NULL,
    step_type VARCHAR(20) NOT NULL,
    indices JSONB NOT NULL,
    array_state JSONB NOT NULL
);`}
              </pre>
            </div>

            {/* Analytical SQL Queries */}
            <div className="bg-[#080d1a] rounded-xl border border-slate-800 overflow-hidden">
              <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                <span className="text-xs font-mono text-slate-300">analytics_queries.sql</span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `-- Calculate average comparisons and swaps across array topologies
SELECT 
    algorithm,
    distribution,
    COUNT(*) as total_runs,
    ROUND(AVG(comparisons), 1) as avg_comparisons,
    ROUND(AVG(swaps), 1) as avg_swaps,
    ROUND(AVG(duration_ms), 3) as avg_latency_ms
FROM experiment_runs
WHERE array_size = 30
GROUP BY algorithm, distribution
ORDER BY avg_comparisons ASC;`,
                      'queries'
                    )
                  }
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copiedCode === 'queries' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'queries' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-cyan-200/90 overflow-x-auto leading-relaxed">
{`-- Calculate empirical average comparisons & swaps
SELECT 
    algorithm,
    distribution,
    COUNT(*) as total_runs,
    ROUND(AVG(comparisons), 1) as avg_comps,
    ROUND(AVG(swaps), 1) as avg_swaps,
    ROUND(AVG(duration_ms), 3) as avg_latency_ms
FROM experiment_runs
WHERE array_size = 30
GROUP BY algorithm, distribution
ORDER BY avg_comps ASC;

-- Percentile operation distribution (IQR)
SELECT 
    algorithm,
    percentile_cont(0.25) WITHIN GROUP (ORDER BY comparisons) as q1,
    percentile_cont(0.50) WITHIN GROUP (ORDER BY comparisons) as median,
    percentile_cont(0.75) WITHIN GROUP (ORDER BY comparisons) as q3
FROM experiment_runs
GROUP BY algorithm;`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Python Source Code Viewer */}
      {activeAnalysisTab === 'code' && (
        <div className="bg-[#0b1120] border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  Python Backend & Analytics Modules
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                The Python backend implements sorting generators with step-snapshots, FastAPI endpoints, and Seaborn statistical plotting.
              </p>
            </div>
          </div>

          <div className="bg-[#060a14] border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-[#0d1322] px-4 py-2 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400">backend/algorithms.py & seaborn_plots.py</span>
              <button
                onClick={() =>
                  copyToClipboard(
                    `import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
from typing import List, Dict, Any

def generate_seaborn_distribution_plot(runs_df: pd.DataFrame, output_path: str = "dist.png"):
    """Generates publication-quality KDE density plot comparing algorithm operation counts."""
    sns.set_theme(style="darkgrid", palette="muted")
    plt.figure(figsize=(10, 6), facecolor="#080c14")
    
    ax = sns.kdeplot(
        data=runs_df,
        x="comparisons",
        hue="algorithm",
        common_norm=False,
        fill=True,
        alpha=0.35,
        linewidth=2.5
    )
    plt.title("CodeFlux: Empirical Comparison Densities", color="white", fontsize=14, pad=15)
    plt.xlabel("Comparison Operations", color="#94a3b8")
    plt.ylabel("Probability Density", color="#94a3b8")
    plt.savefig(output_path, dpi=300, bbox_inches="tight", facecolor="#080c14")
    plt.close()`,
                    'pycode'
                  )
                }
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedCode === 'pycode' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'pycode' ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
from typing import List, Dict, Any

def generate_seaborn_distribution_plot(runs_df: pd.DataFrame, output_path: str = "dist.png"):
    """
    Generates publication-quality KDE density plot comparing algorithm operation counts.
    Used by CodeFlux to visualize variance across random seeds.
    """
    sns.set_theme(style="darkgrid", palette="muted")
    fig, ax = plt.subplots(figsize=(10, 5.5), facecolor="#080c14")
    ax.set_facecolor("#0b1120")
    
    sns.kdeplot(
        data=runs_df,
        x="comparisons",
        hue="algorithm",
        common_norm=False,
        fill=True,
        alpha=0.35,
        linewidth=2.5,
        palette=["#f59e0b", "#06b6d4", "#8b5cf6", "#ec4899", "#10b981"]
    )
    plt.title("CodeFlux: Empirical Operation Distributions", color="white", fontsize=13, pad=12)
    plt.xlabel("Operations Count", color="#94a3b8")
    plt.ylabel("Gaussian Kernel Density", color="#94a3b8")
    plt.tight_layout()
    plt.savefig(output_path, dpi=300, facecolor="#080c14")
    plt.close()

def generate_seaborn_boxplot(runs_df: pd.DataFrame, output_path: str = "box.png"):
    """Generates box-and-whisker plot for interquartile ranges."""
    plt.figure(figsize=(9, 4.5), facecolor="#080c14")
    sns.boxplot(data=runs_df, x="algorithm", y="comparisons", palette="Spectral")
    plt.savefig(output_path, dpi=300, facecolor="#080c14")
    plt.close()`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
