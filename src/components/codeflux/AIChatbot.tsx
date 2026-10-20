import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  KeyRound,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'model' | 'system_error';
  text: string;
  timestamp: string;
  errorType?: string;
  actionHint?: string;
}

interface AIChatbotProps {
  currentAlgorithm?: string;
  currentStep?: any;
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({
  currentAlgorithm = 'Bubble Sort',
  currentStep,
  isOpen: externalIsOpen,
  onToggle,
  onClose: externalOnClose,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const setIsOpen = (open: boolean) => {
    if (onToggle && externalIsOpen !== undefined) {
      if (open !== isOpen) onToggle();
    } else {
      setInternalIsOpen(open);
    }
  };
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isKeyConfigured, setIsKeyConfigured] = useState<boolean | null>(null);
  const [activeModel, setActiveModel] = useState<string>('gemini-3.5-flash-lite');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'model',
      text: `👋 **Welcome to CodeFlux AI Tutor!**\n\nI am powered by **Google Gemini** to assist you with real-time algorithm insights.\n\nYou can ask me to:\n- Explain comparisons, swaps, or partition steps in your current sorting run\n- Break down Big-O recurrence relations ($T(N) = 2T(N/2) + O(N)$)\n- Provide Python, C++, or TypeScript implementations\n- Analyze worst-case scenarios, stability invariants, and edge cases.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check server configuration status on mount
  const checkStatus = async () => {
    try {
      const res = await fetch('/api/tutor/status');
      if (res.ok) {
        const data = await res.json();
        setIsKeyConfigured(Boolean(data.configured));
        if (data.model) {
          setActiveModel(data.model);
        }
      } else {
        setIsKeyConfigured(false);
      }
    } catch {
      setIsKeyConfigured(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    // Format prior conversation history for multi-turn chat
    const conversationHistory = messages
      .filter((m) => m.sender === 'user' || m.sender === 'model')
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuestion: text,
          currentAlgorithm,
          currentStep,
          messages: conversationHistory,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        // Handle categorized errors without silently faking a response
        let hint = 'Please verify your server and connection.';
        if (data.error === 'MISSING_API_KEY') {
          hint = 'Create a .env file in the project root with GEMINI_API_KEY=your_key and restart with npm run dev.';
          setIsKeyConfigured(false);
        } else if (data.error === 'INVALID_API_KEY') {
          hint = 'Check your API key credentials at https://aistudio.google.com/apikey.';
        } else if (data.error === 'RATE_LIMIT_EXCEEDED') {
          hint = 'Wait a moment before submitting your next question.';
        }

        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          sender: 'system_error',
          text: data.message || 'Unable to communicate with the AI model.',
          errorType: data.error || 'API_ERROR',
          actionHint: hint,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
        return;
      }

      setIsKeyConfigured(true);
      const modelMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        sender: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      // Network or connection failure
      const netErrorMsg: ChatMessage = {
        id: `net-err-${Date.now()}`,
        sender: 'system_error',
        text: 'Network connection failed. The local server may be down or unreachable at http://localhost:3000.',
        errorType: 'NETWORK_ERROR',
        actionHint: 'Ensure your backend development server is running via "npm run dev".',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, netErrorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    `Why does ${currentAlgorithm} have this complexity?`,
    'Explain the difference between stable and unstable sorts',
    'How does partition work in QuickSort?',
    'Show Python implementation with comments',
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-[0_8px_32px_0_rgba(147,51,234,0.37)] hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20 backdrop-blur-md group"
          title="Open AI Algorithm Tutor"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
            <span
              className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${
                isKeyConfigured === false ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'
              }`}
            />
            <span
              className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${
                isKeyConfigured === false ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            />
          </div>
          <span className="tracking-wide">Ask AI Tutor</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-cyan-200">
            Gemini
          </span>
        </button>
      )}

      {/* Floating Glassmorphic Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[94vw] sm:w-[460px] h-[600px] max-h-[85vh] flex flex-col rounded-2xl bg-[#080d1e]/95 border border-white/15 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Bot className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">CodeFlux AI Tutor</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/50">
                    {activeModel}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isKeyConfigured === false ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                  />
                  <span>
                    {isKeyConfigured === false ? 'Setup Required' : `Context: ${currentAlgorithm}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={checkStatus}
                title="Check API Status"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setMessages([messages[0]])}
                title="Reset conversation"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Local Development Warning Banner if Key Missing */}
          {isKeyConfigured === false && (
            <div className="bg-amber-950/50 border-b border-amber-800/60 p-3 flex items-start gap-2.5 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-amber-300">Local Setup Notice: GEMINI_API_KEY Missing</div>
                <div className="text-[11px] text-amber-200/80 leading-relaxed">
                  To enable live AI responses locally, create a <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">.env</code> file in your project root with your key:
                  <div className="font-mono bg-black/50 p-1.5 rounded mt-1 text-[10px] text-amber-100 select-all">
                    GEMINI_API_KEY=your_actual_key_here
                  </div>
                </div>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-cyan-300 hover:underline pt-0.5"
                >
                  <span>Get a free Gemini API key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender !== 'user' && (
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      msg.sender === 'system_error'
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        : 'bg-purple-500/20 border-purple-500/30 text-cyan-300'
                    }`}
                  >
                    {msg.sender === 'system_error' ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed relative group ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                      : msg.sender === 'system_error'
                      ? 'bg-rose-950/40 border border-rose-800/60 text-rose-200 rounded-tl-none space-y-2'
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {msg.sender === 'system_error' && msg.actionHint && (
                    <div className="pt-2 border-t border-rose-800/50 text-[11px] text-rose-300/90 font-mono">
                      <b>How to fix:</b> {msg.actionHint}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-white/5 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'model' && (
                      <button
                        onClick={() => copyText(msg.text, msg.id)}
                        className="hover:text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-slate-400">
                <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-cyan-300 flex-shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce delay-300" />
                  <span className="text-[11px] text-slate-400 ml-1">Analyzing algorithm...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Pills */}
          <div className="px-3 py-2 bg-white/[0.02] border-t border-white/5 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(qp)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-mono whitespace-nowrap border border-white/10 flex-shrink-0 transition-all hover:border-cyan-400/50"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-white/10 bg-white/5 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about sorting or complexity..."
              className="flex-1 bg-black/40 text-white text-xs rounded-xl px-3.5 py-2.5 border border-white/10 focus:outline-none focus:border-cyan-400/70 placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-black font-bold transition-all shadow-md shadow-cyan-500/20 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
