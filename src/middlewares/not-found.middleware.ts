import { Request, Response } from 'express';

// Renvoyé pour toute route non déclarée.
export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ error: 'Route not found' });
}
