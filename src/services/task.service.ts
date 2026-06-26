import { prisma } from '../lib/prisma';
import { NotFoundError } from '../lib/errors';
import { CreateTaskInput, UpdateTaskInput, TaskStatus } from '../types';

// Couche métier : encapsule l'accès aux données et les règles (ex. existence d'une tâche).
async function list() {
  return prisma.task.findMany({ orderBy: { id: 'asc' } });
}

async function getById(id: number) {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    throw new NotFoundError(`Task ${id} not found`);
  }
  return task;
}

async function create(data: CreateTaskInput) {
  return prisma.task.create({ data });
}

async function update(id: number, data: UpdateTaskInput) {
  await getById(id); // lève NotFoundError si absente
  return prisma.task.update({ where: { id }, data });
}

async function updateStatus(id: number, status: TaskStatus) {
  await getById(id);
  return prisma.task.update({ where: { id }, data: { status } });
}

async function remove(id: number) {
  await getById(id);
  await prisma.task.delete({ where: { id } });
}

export const taskService = { list, getById, create, update, updateStatus, remove };
