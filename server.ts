import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  handleTutorStatus,
  handleTutorChat,
  getGeminiApiKey,
  getGeminiModel,
} from './src/server/geminiHandler.ts';

// Resolve directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// Health and AI Tutor Status Endpoint
app.get('/api/tutor/status', async (_req, res) => {
  try {
    const statusData = await handleTutorStatus();
    res.json(statusData);
  } catch (err: any) {
    res.status(500).json({ error: 'STATUS_ERROR', message: err?.message || 'Server error' });
  }
});

// AI Tutor Chat Request Handler
app.post('/api/chat', async (req, res) => {
  try {
    const result = await handleTutorChat(req.body);
    res.status(result.status).json(result.body);
  } catch (error: any) {
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: error?.message || 'An unexpected server error occurred.',
    });
  }
});

// Setup dev server with Vite middleware or serve production static assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CodeFlux] Application ready at http://localhost:${PORT}`);
    const key = getGeminiApiKey();
    if (!key) {
      console.warn(
        `[CodeFlux Warning] GEMINI_API_KEY is not configured. Set GEMINI_API_KEY in your .env file to enable AI Tutor.`
      );
    } else {
      console.log(`[CodeFlux] GEMINI_API_KEY detected. AI Tutor enabled using model: ${getGeminiModel()}`);
    }
  });
}

startServer();
