import { z } from 'zod';

const statusEnum = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);
const priorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const createTaskSchema = z.object({
  title: z.string({ required_error: 'title is required' }).trim().min(1, 'title is required').max(255),
  description: z.string().max(2000).optional(),
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'at least one field must be provided',
  });

export const statusSchema = z.object({ status: statusEnum });

export const idSchema = z.coerce.number().int().positive();
