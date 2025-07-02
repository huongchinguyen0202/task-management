import request from 'supertest';
import app from '../../../app';
import db from '../../../db';
import { Pool } from 'pg';

let token: string;
let createdTaskId: number;

beforeAll(async () => {
  // Create a test user and get JWT token
  await db.query("DELETE FROM users WHERE email = 'apitest@example.com'");
  await request(app)
    .post('/api/auth/register')
    .send({ email: 'apitest@example.com', password: 'Test1234!' });
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'apitest@example.com', password: 'Test1234!' });
  console.log('LOGIN RESPONSE:', res.body); // Debug log
  token = res.body?.data?.token;
  if (!token) throw new Error('Login failed: ' + JSON.stringify(res.body));
});

afterAll(async () => {
  await db.query('DELETE FROM tasks WHERE user_id IN (SELECT id FROM users WHERE email = $1)', ['apitest@example.com']);
  await db.query('DELETE FROM users WHERE email = $1', ['apitest@example.com']);
  await db.end && db.end();
});

describe('Task API Integration', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Integration Test Task', description: 'desc', due_date: '2025-07-03' });
    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Integration Test Task');
    createdTaskId = res.body.data.id;
  });

  it('should get all tasks for the user', async () => {
    const res = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should get a task by id', async () => {
    const res = await request(app)
      .get(`/api/v1/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(createdTaskId);
  });

  it('should update a task', async () => {
    const res = await request(app)
      .put(`/api/v1/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' });
    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('Updated Title');
  });

  it('should delete a task', async () => {
    const res = await request(app)
      .delete(`/api/v1/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 404 for non-existent task', async () => {
    const res = await request(app)
      .get('/api/v1/tasks/999999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('should require authentication', async () => {
    const res = await request(app)
      .get('/api/v1/tasks');
    expect(res.status).toBe(401);
  });
});
