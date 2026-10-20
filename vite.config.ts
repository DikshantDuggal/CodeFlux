import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { handleTutorStatus, handleTutorChat } from './src/server/geminiHandler.ts';

/**
 * Vite plugin that provides /api/chat and /api/tutor/status routes
 * directly in Vite dev server. This guarantees that local developers
 * running either `npm run dev` (Express + Vite) or `npx vite` / Vite tools
 * will have working AI Tutor endpoints without manual proxy configuration.
 */
function aiTutorDevPlugin(): Plugin {
  return {
    name: 'codeflux-ai-tutor-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();
        const pathname = req.url.split('?')[0];

        if (pathname === '/api/tutor/status' && req.method === 'GET') {
          try {
            const status = await handleTutorStatus();
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(status));
          } catch (err: any) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'STATUS_ERROR', message: err?.message || 'Server error' }));
          }
          return;
        }

        if (pathname === '/api/chat' && req.method === 'POST') {
          let bodyRaw = '';
          req.on('data', (chunk) => {
            bodyRaw += chunk;
          });
          req.on('end', async () => {
            try {
              const body = bodyRaw ? JSON.parse(bodyRaw) : {};
              const result = await handleTutorChat(body);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = result.status;
              res.end(JSON.stringify(result.body));
            } catch (err: any) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(
                JSON.stringify({
                  error: 'SERVER_ERROR',
                  message: err?.message || 'Invalid request body or server error',
                })
              );
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), aiTutorDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
