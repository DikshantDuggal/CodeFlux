import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables locally
const rootDir = process.cwd();
const envLocalPath = path.resolve(rootDir, '.env.local');
const envPath = path.resolve(rootDir, '.env');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}
dotenv.config();

const PLACEHOLDER_KEYS = new Set([
  'your_actual_gemini_api_key_here',
  'my_gemini_api_key',
  'your_key_here',
  'placeholder',
  'changeme',
]);

export function getGeminiApiKey(): string {
  const rawKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY ||
    '';

  const cleaned = rawKey.trim().replace(/^["']|["']$/g, '');
  if (!cleaned || PLACEHOLDER_KEYS.has(cleaned.toLowerCase())) {
    return '';
  }
  return cleaned;
}

export function getGeminiModel(): string {
  return (process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite').trim();
}

export interface ChatTurn {
  role: 'user' | 'model';
  content: string;
}

export interface HandleChatRequestOptions {
  userQuestion?: string;
  currentAlgorithm?: string;
  currentStep?: any;
  messages?: ChatTurn[];
}

export async function handleTutorStatus() {
  const key = getGeminiApiKey();
  const configured = key.length > 0;
  return {
    status: 'ok',
    configured,
    model: getGeminiModel(),
    environment: process.env.NODE_ENV || 'development',
  };
}

export async function handleTutorChat(body: HandleChatRequestOptions) {
  const { messages = [], currentAlgorithm, currentStep, userQuestion } = body;
  const question = (userQuestion || '').trim();

  if (!question && messages.length === 0) {
    return {
      status: 400,
      body: {
        error: 'INVALID_REQUEST',
        message: 'A user question or message history is required.',
      },
    };
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return {
      status: 400,
      body: {
        error: 'MISSING_API_KEY',
        message:
          'GEMINI_API_KEY is not configured in your local environment. Create a .env file in the project root with your Gemini API key (e.g. GEMINI_API_KEY=AIzaSy...) and restart the server with "npm run dev". Obtain a free key at https://aistudio.google.com/apikey',
        configured: false,
      },
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  const modelName = getGeminiModel();

  const systemInstruction = `You are CodeFlux AI Tutor, a computer science educator and algorithm specialist.
You help university students, developers, and educators master sorting algorithms, computational complexity (Big O, Big Omega, Big Theta), recurrence relations, invariant proofs, and data structures.
Guidelines:
- Be clear, rigorous, encouraging, and pedagogically sound.
- When explaining comparisons or swaps, relate them to the active algorithm context and array state.
- Format responses cleanly with Markdown, highlighting code blocks with syntax highlighting and complexity in math notation ($O(N \\log N)$).
- Provide concrete Python, C++, or TypeScript code examples when asked.
- Help students debug common misconceptions (e.g., stability of Selection Sort, QuickSort pivot degradation, MergeSort space requirements).`;

  // Build conversation contents
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  for (const msg of messages) {
    if ((msg.role === 'user' || msg.role === 'model') && typeof msg.content === 'string' && msg.content.trim()) {
      contents.push({
        role: msg.role,
        parts: [{ text: msg.content.trim() }],
      });
    }
  }

  let promptText = question;
  if (currentAlgorithm || currentStep) {
    const contextPrefix = `[Context: Algorithm="${currentAlgorithm || 'General CS'}" | Current Step: ${JSON.stringify(
      currentStep || {}
    )}]\n\n`;
    promptText = contextPrefix + question;
  }

  contents.push({
    role: 'user',
    parts: [{ text: promptText }],
  });

  // Call Gemini API with timeout protection (15 seconds)
  const apiCallPromise = ai.models.generateContent({
    model: modelName,
    contents,
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('GEMINI_TIMEOUT: Request timed out after 15 seconds.'));
    }, 15000);
  });

  try {
    const response = await Promise.race([apiCallPromise, timeoutPromise]);
    const replyText = response.text;

    if (!replyText) {
      return {
        status: 502,
        body: {
          error: 'EMPTY_RESPONSE',
          message: 'The AI model returned an empty response. Please try rephrasing your question.',
        },
      };
    }

    return {
      status: 200,
      body: {
        role: 'model',
        text: replyText,
        model: modelName,
        configured: true,
      },
    };
  } catch (error: any) {
    const errorMsg = error?.message || String(error);
    const statusCode = error?.status || 500;

    // Log diagnostic info safely without exposing API keys
    console.error(`[AI Tutor Error] HTTP ${statusCode}: ${errorMsg.slice(0, 180)}`);

    if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('403') || errorMsg.includes('API key not valid')) {
      return {
        status: 401,
        body: {
          error: 'INVALID_API_KEY',
          message:
            'The provided GEMINI_API_KEY is invalid or unauthorized. Please verify your API key in the .env file.',
        },
      };
    }

    if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
      return {
        status: 429,
        body: {
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Gemini API rate limit or quota exceeded. Please wait a few seconds and try again.',
        },
      };
    }

    if (errorMsg.includes('GEMINI_TIMEOUT')) {
      return {
        status: 504,
        body: {
          error: 'TIMEOUT',
          message:
            'The Gemini API request timed out. Please check your network connection or try a shorter question.',
        },
      };
    }

    if (errorMsg.includes('NOT_FOUND') || errorMsg.includes('404')) {
      return {
        status: 404,
        body: {
          error: 'MODEL_NOT_FOUND',
          message: `The configured Gemini model "${modelName}" was not found. Try setting GEMINI_MODEL=gemini-3.5-flash-lite in .env.`,
        },
      };
    }

    return {
      status: 500,
      body: {
        error: 'SERVER_ERROR',
        message: 'Failed to communicate with the Gemini API. Please check your network connection and server logs.',
        details: process.env.NODE_ENV !== 'production' ? errorMsg.slice(0, 150) : undefined,
      },
    };
  }
}
