import { Request, Response } from 'express';
import { errorHandler } from './error.middleware';
import { AppError, NotFoundError } from '../lib/errors';

function mockRes(): Response {
  const res = {} as Record<string, unknown>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as unknown as Response;
}

const noop = (() => undefined) as unknown as Parameters<typeof errorHandler>[3];

describe('errorHandler', () => {
  it('traduit une AppError en réponse HTTP correspondante', () => {
    const res = mockRes();
    errorHandler(new NotFoundError('absent'), {} as Request, res, noop);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'absent' });
  });

  it('utilise le statusCode d\'une AppError générique', () => {
    const res = mockRes();
    errorHandler(new AppError(418, 'teapot'), {} as Request, res, noop);
    expect(res.status).toHaveBeenCalledWith(418);
  });

  it('renvoie 500 pour une erreur inattendue', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const res = mockRes();
    errorHandler(new Error('boom'), {} as Request, res, noop);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    spy.mockRestore();
  });
});
