jest.mock('../lib/prisma', () => ({
  prisma: {
    task: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { taskService } from './task.service';
import { prisma } from '../lib/prisma';
import { NotFoundError } from '../lib/errors';

const db = prisma as unknown as { task: Record<string, jest.Mock> };

const sample = { id: 1, title: 'T', status: 'TODO', priority: 'MEDIUM' };

describe('taskService', () => {
  it('list() retourne les tâches triées', async () => {
    db.task.findMany.mockResolvedValue([sample]);
    const result = await taskService.list();
    expect(result).toEqual([sample]);
    expect(db.task.findMany).toHaveBeenCalledWith({ orderBy: { id: 'asc' } });
  });

  it('getById() retourne la tâche existante', async () => {
    db.task.findUnique.mockResolvedValue(sample);
    await expect(taskService.getById(1)).resolves.toEqual(sample);
  });

  it('getById() lève NotFoundError si absente', async () => {
    db.task.findUnique.mockResolvedValue(null);
    await expect(taskService.getById(99)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('create() délègue à prisma.create', async () => {
    db.task.create.mockResolvedValue(sample);
    const result = await taskService.create({ title: 'T' });
    expect(result).toEqual(sample);
    expect(db.task.create).toHaveBeenCalledWith({ data: { title: 'T' } });
  });

  it('update() met à jour si la tâche existe', async () => {
    db.task.findUnique.mockResolvedValue(sample);
    db.task.update.mockResolvedValue({ ...sample, title: 'New' });
    const result = await taskService.update(1, { title: 'New' });
    expect(result.title).toBe('New');
  });

  it('update() lève NotFoundError si absente', async () => {
    db.task.findUnique.mockResolvedValue(null);
    await expect(taskService.update(1, { title: 'New' })).rejects.toBeInstanceOf(NotFoundError);
    expect(db.task.update).not.toHaveBeenCalled();
  });

  it('updateStatus() change le statut si la tâche existe', async () => {
    db.task.findUnique.mockResolvedValue(sample);
    db.task.update.mockResolvedValue({ ...sample, status: 'DONE' });
    const result = await taskService.updateStatus(1, 'DONE');
    expect(result.status).toBe('DONE');
    expect(db.task.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { status: 'DONE' } });
  });

  it('updateStatus() lève NotFoundError si absente', async () => {
    db.task.findUnique.mockResolvedValue(null);
    await expect(taskService.updateStatus(1, 'DONE')).rejects.toBeInstanceOf(NotFoundError);
  });

  it('remove() supprime si la tâche existe', async () => {
    db.task.findUnique.mockResolvedValue(sample);
    db.task.delete.mockResolvedValue(sample);
    await taskService.remove(1);
    expect(db.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('remove() lève NotFoundError si absente', async () => {
    db.task.findUnique.mockResolvedValue(null);
    await expect(taskService.remove(1)).rejects.toBeInstanceOf(NotFoundError);
    expect(db.task.delete).not.toHaveBeenCalled();
  });
});
