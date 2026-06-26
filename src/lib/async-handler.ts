import { Request, Response, NextFunction, RequestHandler } from 'express';

// Enrobe un handler asynchrone pour transmettre toute erreur au middleware d'erreurs Express.
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
