import express, { Application } from 'express';
import taskRoutes from './routes/task.routes';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/not-found.middleware';

// Construit l'application Express (sans la démarrer) — pratique pour les tests e2e.
export function createApp(): Application {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/tasks', taskRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
