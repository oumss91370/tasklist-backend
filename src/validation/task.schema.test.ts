import {
  createTaskSchema,
  updateTaskSchema,
  statusSchema,
  idSchema,
} from './task.schema';

describe('validation: createTaskSchema', () => {
  it('accepte une tâche minimale valide', () => {
    const result = createTaskSchema.safeParse({ title: 'Ma tâche' });
    expect(result.success).toBe(true);
  });

  it('accepte tous les champs valides', () => {
    const result = createTaskSchema.safeParse({
      title: 'T',
      description: 'desc',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: '2026-01-01',
    });
    expect(result.success).toBe(true);
  });

  it('refuse un titre vide', () => {
    const result = createTaskSchema.safeParse({ title: '   ' });
    expect(result.success).toBe(false);
  });

  it('refuse un titre manquant', () => {
    const result = createTaskSchema.safeParse({ description: 'x' });
    expect(result.success).toBe(false);
  });

  it('refuse un status invalide', () => {
    const result = createTaskSchema.safeParse({ title: 'T', status: 'NOPE' });
    expect(result.success).toBe(false);
  });
});

describe('validation: updateTaskSchema', () => {
  it('accepte une mise à jour partielle', () => {
    expect(updateTaskSchema.safeParse({ title: 'T' }).success).toBe(true);
  });

  it('refuse un objet vide', () => {
    expect(updateTaskSchema.safeParse({}).success).toBe(false);
  });
});

describe('validation: statusSchema', () => {
  it('accepte un status valide', () => {
    expect(statusSchema.safeParse({ status: 'DONE' }).success).toBe(true);
  });
  it('refuse un status invalide', () => {
    expect(statusSchema.safeParse({ status: 'X' }).success).toBe(false);
  });
});

describe('validation: idSchema', () => {
  it('coerce une chaîne numérique', () => {
    const result = idSchema.safeParse('42');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(42);
  });
  it('refuse une chaîne non numérique', () => {
    expect(idSchema.safeParse('abc').success).toBe(false);
  });
  it('refuse un nombre négatif', () => {
    expect(idSchema.safeParse('-1').success).toBe(false);
  });
});
