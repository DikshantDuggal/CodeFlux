<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0A0A0A,50:0d1b2a,100:1a1a2e&height=220&section=header&text=CodeFlux&fontSize=72&fontColor=00D26A&animation=fadeIn&fontAlignY=38&desc=Algorithms%20you%20can%20see%2C%20break%2C%20and%20actually%20understand&descAlignY=60&descSize=18&descColor=B8B8B8" width="100%"/>
</p>

<p align="center">
  <a href="https://github.com/DikshantDuggal/CodeFlux"><img src="https://img.shields.io/badge/Status-Live-00D26A?style=for-the-badge&logo=vercel&logoColor=white" /></a>
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-Apache_2.0-blue?style=flat-square" />
  <img src="https://img.shields.io/github/last-commit/DikshantDuggal/CodeFlux?style=flat-square&color=00D26A" />
  <img src="https://img.shields.io/github/repo-size/DikshantDuggal/CodeFlux?style=flat-square&color=8E75B2" />
</p>

<br/>

<div align="center">

> 🧪 **Not a video. Not a slideshow. A lab.**
>
> Step through sorting algorithms yourself — watch pointers move, swaps happen, pivots get chosen — while an AI tutor sits next to it and actually knows what's on screen.

</div>

<br/>

---

<br/>

## 💡 Why I Built This

I kept watching 40-minute sorting tutorials and still freezing the second I opened a blank editor.

The problem isn't the explanations — it's that you're watching someone else's understanding. You need to **build your own**. CodeFlux is the lab I wish I had: you step through the algorithm, predict what happens next, race two algorithms on the same data, and get an AI tutor that sees exactly what's on your screen.

<br/>

## ⚡ Feature Map

<table>
<tr>
<td width="50%">

### 🔬 Algorithm Lab
Step forward, backward, or auto-play **Bubble, Selection, Insertion, Quick, and Merge Sort**. Every comparison, swap, and pivot is color-coded. The pseudocode highlights in sync with the array — line by line.

**Live telemetry** tracks comparisons, swaps, array accesses, and step progress with a scrubbing timeline.

</td>
<td width="50%">

### 🏎️ Race Track
Put two algorithms on the **exact same input** and watch them go head-to-head. Comparisons and swaps rack up in real time side-by-side.

Seeing QuickSort lap Bubble Sort does more than any Big-O table ever will. Winner announced with empirical operation counts.

</td>
</tr>
<tr>
<td width="50%">

### 🎯 Predict Mode
The run pauses mid-execution and asks: **"What happens next?"**

Will it swap? Will it skip? You find out immediately if your intuition is right. Streak scoring keeps you honest.

</td>
<td width="50%">

### 🧠 Complexity Quiz
Time, space, stability, invariants — with recurrence-relation breakdowns like:

```
T(N) = 2T(N/2) + O(N)  ⟹  O(N log N)
```

Streak-scored, category-tagged, with detailed post-answer explanations.

</td>
</tr>
<tr>
<td width="50%">

### 🤖 AI Tutor  <sup><code>Gemini-powered</code></sup>
Not a generic chatbot bolted on the side. It sees the **active algorithm and array state**, so *"why did it swap there?"* gets a real answer — with context, code examples, and complexity notation.

</td>
<td width="50%">

### 🕹️ Sort Rush
A drag-and-drop arcade mode. Timed. Combo-scored. Sound effects via Web Audio synthesis.

For when you want the intuition **in your hands**, not just your eyes.

</td>
</tr>
<tr>
<td width="50%">

### 📊 Analytics Hub
Interactive system-architecture graph, empirical runtime distributions, and KDE plots. For when you want the **proof**, not just the vibes.

</td>
<td width="50%">

### 🌌 3D Data Stream
A Three.js particle canvas with stream, helix, and bar modes running underneath it all. Not load-bearing — just makes it feel like a lab instead of a worksheet.

</td>
</tr>
</table>

<br/>

### 🎹 Bonus: Keyboard Shortcuts & Onboarding

Full keyboard navigation (`1`–`9` for tabs, `?` for help, `T` for tour). First-time onboarding walkthrough built-in.

<br/>

---

<br/>

## 🚀 Getting Started

```bash
git clone https://github.com/DikshantDuggal/CodeFlux.git
cd CodeFlux
npm install
cp .env.example .env   # add your GEMINI_API_KEY for the AI Tutor
npm run dev
```

Then open **[localhost:3000](http://localhost:3000)** ✨

> [!NOTE]
> **Everything except the AI Tutor runs fully offline** — the visualizers, the race track, the quiz, predict mode, the game, all of it. The AI Tutor requires a free [Google Gemini API key](https://aistudio.google.com/apikey).

<br/>

---

<br/>

## 🏗️ Architecture

```
CodeFlux/
├── server.ts                Express + Vite dev middleware — one command, full stack
├── vite.config.ts            Vite 8 + React plugin + Tailwind v4 + AI Tutor dev plugin
├── src/
│   ├── algorithms/           Pure, unit-tested sorting implementations
│   │   ├── bubbleSort.ts       Every step: compare → swap → explanation → pseudocode line
│   │   ├── selectionSort.ts
│   │   ├── insertionSort.ts
│   │   ├── quickSort.ts
│   │   ├── mergeSort.ts
│   │   ├── types.ts            AlgorithmStep, AlgorithmMetadata, AlgorithmRunResult
│   │   ├── index.ts            Registry, runners, array preset generator
│   │   └── sorting.test.ts     Node.js native test runner
│   ├── components/codeflux/
│   │   ├── AlgorithmLab.tsx     Step-through visualizer with live telemetry
│   │   ├── AlgorithmRace.tsx    Side-by-side dual-lane benchmark arena
│   │   ├── PredictMode.tsx      Predictive challenge engine
│   │   ├── ComplexityQuiz.tsx   Recurrence-relation quiz system
│   │   ├── AIChatbot.tsx        Gemini-powered contextual tutor
│   │   ├── SortingGame.tsx      Timed arcade mode with Web Audio
│   │   ├── TechStackAnalytics.tsx  Architecture graph + runtime KDE plots
│   │   ├── ThreeDataStream.tsx  Three.js particle scene (stream/helix/bars)
│   │   ├── VisualizerCanvas.tsx Color-coded bar renderer
│   │   ├── PseudocodePanel.tsx  Sync-highlighted pseudocode
│   │   ├── ControlPanel.tsx     Speed, size, presets, playback controls
│   │   └── ...                  Navbar, Tour, Shortcuts, Resources, Debug
│   ├── hooks/
│   │   └── useKeyboardShortcuts.ts  Global hotkey manager
│   └── server/
│       └── geminiHandler.ts     Gemini API integration (key validation, timeout, error handling)
└── .env.example
```

<br/>

<details>
<summary><b>🔌 How the AI Tutor Works</b></summary>

<br/>

The AI Tutor is **not** a client-side integration. Your API key never touches the browser.

```
Browser ──POST /api/chat──▶ Express Server ──▶ Google Gemini API
                               │
                    ┌──────────┘
                    ▼
          System Prompt: "You are CodeFlux AI Tutor..."
          + [Context: Algorithm="Quick Sort" | Step={...}]
          + Conversation history
```

- **Server-side only** — API key stays in `.env`, never shipped to client
- **Context-aware** — every request includes the active algorithm name + current step state
- **15s timeout** with graceful fallback messaging
- **Smart error handling** — invalid key, rate limits, model-not-found, timeouts all produce specific, actionable messages

</details>

<br/>

---

<br/>

## ⚙️ Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | For AI Tutor | — | Free key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `GEMINI_MODEL` | No | `gemini-3.5-flash-lite` | `gemini-3.5-flash-lite` · `gemini-3.5-flash` · `gemini-3.8-flash` |
| `PORT` | No | `3000` | Server port |

<br/>

---

<br/>

## 🧪 Testing

The sorting algorithms are unit-tested with Node's native test runner:

```bash
npx tsx --test src/algorithms/sorting.test.ts
```

Tests cover arbitrary, reversed, nearly-sorted, duplicate, and single-element inputs across all five algorithms.

<br/>

---

<br/>

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | React 19 + TypeScript | Sub-millisecond step-scrubbing, reactive state for live telemetry |
| **Styling** | Tailwind CSS v4 | Utility-first, zero-runtime, glassmorphic dark UI |
| **3D** | Three.js | Particle canvas, fog, ACES filmic tone mapping |
| **Animations** | Motion (Framer Motion) | Smooth transitions, spring physics |
| **Icons** | Lucide React | Clean, consistent iconography |
| **Backend** | Express + Vite Middleware | One command starts full stack — API + HMR + SPA |
| **AI** | Google Gemini API (`@google/genai`) | Context-aware tutoring with conversation history |
| **Bundler** | Vite 8 | Instant HMR, native ESM, optimized builds |

</div>

<br/>

---

<br/>

## 📐 Algorithms Covered

| Algorithm | Best | Average | Worst | Space | Stable | In-Place |
|-----------|------|---------|-------|-------|--------|----------|
| **Bubble Sort** | O(N) | O(N²) | O(N²) | O(1) | ✅ | ✅ |
| **Selection Sort** | O(N²) | O(N²) | O(N²) | O(1) | ❌ | ✅ |
| **Insertion Sort** | O(N) | O(N²) | O(N²) | O(1) | ✅ | ✅ |
| **Quick Sort** | O(N log N) | O(N log N) | O(N²) | O(log N) | ❌ | ✅ |
| **Merge Sort** | O(N log N) | O(N log N) | O(N log N) | O(N) | ✅ | ❌ |

Each implementation generates a complete **step trace** — every comparison, swap, overwrite, and pivot selection is recorded with:
- Array snapshot
- Active indices
- Pseudocode line number
- Running counters (comparisons, swaps, accesses)
- Human-readable explanation

<br/>

---

<br/>

<div align="center">

### 🎯 Array Input Presets

</div>

<p align="center">
  <code>🎲 Random</code> · <code>📈 Nearly Sorted</code> · <code>📉 Reversed</code> · <code>🎨 Few Unique</code> · <code>✏️ Custom Input</code>
</p>

<p align="center">
  Sizes from <b>5 → 30 elements</b> with adjustable playback speed <b>(20ms → 500ms)</b>
</p>

<br/>

---

<br/>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1a2e,50:0d1b2a,100:0A0A0A&height=120&section=footer" width="100%"/>

<br/>

**Built by [Dikshant](https://github.com/DikshantDuggal)** — I like difficult ideas, especially the ones that sound slightly unnecessary at first.

<br/>

<sub>If this helped you understand sorting better, consider giving it a ⭐</sub>

</div>
