import { AppError, BadRequestError, NotFoundError } from './errors';

describe('erreurs applicatives', () => {
  it('AppError porte un statusCode et un message', () => {
    const err = new AppError(418, 'teapot');
    expect(err.statusCode).toBe(418);
    expect(err.message).toBe('teapot');
    expect(err.name).toBe('AppError');
  });

  it('BadRequestError utilise 400 et un message par défaut', () => {
    const err = new BadRequestError();
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Bad request');
  });

  it('BadRequestError accepte un message personnalisé', () => {
    expect(new BadRequestError('champ invalide').message).toBe('champ invalide');
  });

  it('NotFoundError utilise 404 et un message par défaut', () => {
    const err = new NotFoundError();
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Resource not found');
  });

  it('NotFoundError accepte un message personnalisé', () => {
    expect(new NotFoundError('absente').message).toBe('absente');
  });
});
