import request from 'supertest';
import { app } from '../../src/app';
import { prisma } from '../../src/lib/prisma';

const db = prisma as unknown as {
  task: { deleteMany: () => Promise<unknown> };
  $disconnect: () => Promise<void>;
};

beforeEach(async () => {
  await db.task.deleteMany();
});

afterAll(async () => {
  await db.$disconnect();
});

describe('TaskList API (e2e)', () => {
  it('GET /health → 200 { status: ok }', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('GET /api/tasks → [] quand la base est vide', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/tasks → 201 et crée la tâche', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Tâche e2e', priority: 'HIGH' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'Tâche e2e', priority: 'HIGH', status: 'TODO' });
    expect(res.body.id).toBeDefined();
  });

  it('POST /api/tasks sans titre → 400', async () => {
    const res = await request(app).post('/api/tasks').send({ description: 'sans titre' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('GET /api/tasks/:id inexistant → 404', async () => {
    const res = await request(app).get('/api/tasks/9999');
    expect(res.status).toBe(404);
  });

  it('GET /api/tasks/:id invalide → 400', async () => {
    const res = await request(app).get('/api/tasks/abc');
    expect(res.status).toBe(400);
  });

  it('cycle complet : create → get → update → patch status → list → delete → 404', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'A' });
    const id = created.body.id as number;

    expect((await request(app).get(`/api/tasks/${id}`)).status).toBe(200);

    const updated = await request(app)
      .put(`/api/tasks/${id}`)
      .send({ title: 'B', description: 'desc' });
    expect(updated.status).toBe(200);
    expect(updated.body.title).toBe('B');

    const patched = await request(app).patch(`/api/tasks/${id}/status`).send({ status: 'DONE' });
    expect(patched.status).toBe(200);
    expect(patched.body.status).toBe('DONE');

    const list = await request(app).get('/api/tasks');
    expect(list.body).toHaveLength(1);

    expect((await request(app).delete(`/api/tasks/${id}`)).status).toBe(204);
    expect((await request(app).get(`/api/tasks/${id}`)).status).toBe(404);
  });

  it('PUT /api/tasks/:id inexistant → 404', async () => {
    const res = await request(app).put('/api/tasks/8888').send({ title: 'X' });
    expect(res.status).toBe(404);
  });

  it('PATCH status invalide → 400', async () => {
    const created = await request(app).post('/api/tasks').send({ title: 'C' });
    const res = await request(app)
      .patch(`/api/tasks/${created.body.id}/status`)
      .send({ status: 'WRONG' });
    expect(res.status).toBe(400);
  });

  it('route inconnue → 404', async () => {
    const res = await request(app).get('/route-inexistante');
    expect(res.status).toBe(404);
  });
});
