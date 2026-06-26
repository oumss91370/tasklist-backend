import { Request, Response } from 'express';
import { notFoundHandler } from './not-found.middleware';

describe('notFoundHandler', () => {
  it('répond 404 avec un message', () => {
    const res = {} as Record<string, unknown>;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    notFoundHandler({} as Request, res as unknown as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Route not found' });
  });
});
