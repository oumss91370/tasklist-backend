import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors';

// Middleware d'erreurs centralisé : traduit AppError en réponse HTTP, sinon renvoie un 500.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  return res.status(500).json({ error: 'Internal server error' });
}
