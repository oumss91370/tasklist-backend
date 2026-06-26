jest.mock('../services/task.service', () => ({
  taskService: {
    list: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  },
}));

import { Request, Response } from 'express';
import { taskController } from './task.controller';
import { taskService } from '../services/task.service';
import { BadRequestError } from '../lib/errors';

const service = taskService as unknown as Record<string, jest.Mock>;

function mockRes(): Response {
  const res = {} as Record<string, unknown>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as unknown as Response;
}

const req = (params: Record<string, string> = {}, body: unknown = {}) =>
  ({ params, body } as unknown as Request);

describe('taskController', () => {
  it('list() répond avec les tâches', async () => {
    service.list.mockResolvedValue([{ id: 1 }]);
    const res = mockRes();
    await taskController.list(req(), res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('get() avec id valide répond avec la tâche', async () => {
    service.getById.mockResolvedValue({ id: 5 });
    const res = mockRes();
    await taskController.get(req({ id: '5' }), res);
    expect(service.getById).toHaveBeenCalledWith(5);
    expect(res.json).toHaveBeenCalledWith({ id: 5 });
  });

  it('get() avec id invalide lève BadRequestError', async () => {
    const res = mockRes();
    await expect(taskController.get(req({ id: 'abc' }), res)).rejects.toBeInstanceOf(BadRequestError);
  });

  it('create() valide → 201', async () => {
    service.create.mockResolvedValue({ id: 1, title: 'T' });
    const res = mockRes();
    await taskController.create(req({}, { title: 'T' }), res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1, title: 'T' });
  });

  it('create() body invalide → BadRequestError', async () => {
    const res = mockRes();
    await expect(taskController.create(req({}, { description: 'x' }), res)).rejects.toBeInstanceOf(
      BadRequestError
    );
  });

  it('update() valide → json', async () => {
    service.update.mockResolvedValue({ id: 1, title: 'B' });
    const res = mockRes();
    await taskController.update(req({ id: '1' }, { title: 'B' }), res);
    expect(res.json).toHaveBeenCalledWith({ id: 1, title: 'B' });
  });

  it('update() body vide → BadRequestError', async () => {
    const res = mockRes();
    await expect(taskController.update(req({ id: '1' }, {}), res)).rejects.toBeInstanceOf(
      BadRequestError
    );
  });

  it('updateStatus() valide → json', async () => {
    service.updateStatus.mockResolvedValue({ id: 1, status: 'DONE' });
    const res = mockRes();
    await taskController.updateStatus(req({ id: '1' }, { status: 'DONE' }), res);
    expect(res.json).toHaveBeenCalledWith({ id: 1, status: 'DONE' });
  });

  it('updateStatus() status invalide → BadRequestError', async () => {
    const res = mockRes();
    await expect(
      taskController.updateStatus(req({ id: '1' }, { status: 'X' }), res)
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('remove() → 204', async () => {
    service.remove.mockResolvedValue(undefined);
    const res = mockRes();
    await taskController.remove(req({ id: '1' }), res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
