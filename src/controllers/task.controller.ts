import { Request, Response } from 'express';
import { taskService } from '../services/task.service';
import {
  createTaskSchema,
  updateTaskSchema,
  statusSchema,
  idSchema,
} from '../validation/task.schema';
import { BadRequestError } from '../lib/errors';

function parseId(raw: string): number {
  const result = idSchema.safeParse(raw);
  if (!result.success) {
    throw new BadRequestError('Invalid task id');
  }
  return result.data;
}

function formatIssues(error: { issues: { message: string }[] }): string {
  return error.issues.map((issue) => issue.message).join(', ');
}

async function list(_req: Request, res: Response) {
  const tasks = await taskService.list();
  res.json(tasks);
}

async function get(req: Request, res: Response) {
  const task = await taskService.getById(parseId(req.params.id));
  res.json(task);
}

async function create(req: Request, res: Response) {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(formatIssues(parsed.error));
  }
  const task = await taskService.create(parsed.data);
  res.status(201).json(task);
}

async function update(req: Request, res: Response) {
  const id = parseId(req.params.id);
  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(formatIssues(parsed.error));
  }
  const task = await taskService.update(id, parsed.data);
  res.json(task);
}

async function updateStatus(req: Request, res: Response) {
  const id = parseId(req.params.id);
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new BadRequestError(formatIssues(parsed.error));
  }
  const task = await taskService.updateStatus(id, parsed.data.status);
  res.json(task);
}

async function remove(req: Request, res: Response) {
  await taskService.remove(parseId(req.params.id));
  res.status(204).send();
}

export const taskController = { list, get, create, update, updateStatus, remove };
