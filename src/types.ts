// Énumérations métier (déclarées en dur pour rester indépendantes du client Prisma généré,
// qui diffère entre la base MySQL et la base SQLite de test).
export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
}

export type UpdateTaskInput = Partial<CreateTaskInput>;
