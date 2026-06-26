import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from './async-handler';

describe('asyncHandler', () => {
  it('ne transmet pas d\'erreur quand le handler réussit', async () => {
    const next = jest.fn() as unknown as NextFunction;
    const handler = asyncHandler(async (_req, res) => {
      (res as unknown as { ok: boolean }).ok = true;
    });
    const res = {} as Response;
    await handler({} as Request, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('transmet l\'erreur à next quand le handler échoue', async () => {
    const next = jest.fn() as unknown as NextFunction;
    const error = new Error('fail');
    const handler = asyncHandler(async () => {
      throw error;
    });
    await handler({} as Request, {} as Response, next);
    // laisse la microtâche se résoudre
    await new Promise((r) => setImmediate(r));
    expect(next).toHaveBeenCalledWith(error);
  });
});
