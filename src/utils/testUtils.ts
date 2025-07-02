import db from '../db';

export async function clearTestUsers() {
  await db.query("DELETE FROM users WHERE email LIKE 'apitest%'");
}

export async function clearTestTasks() {
  await db.query('DELETE FROM tasks WHERE user_id IN (SELECT id FROM users WHERE email LIKE $1)', ['apitest%']);
}

export async function createTestUser(email = 'apitest@example.com', password = 'Test1234!') {
  // Directly insert user into DB for test setup (hash password if needed)
  await db.query("DELETE FROM users WHERE email = $1", [email]);
  // You may want to hash password here if your DB expects it, or use your service
  // For now, just insert a plain password for test DB
  const res = await db.query(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
    [email, password]
  );
  return res.rows[0]?.id;
}

export async function getTestUserId(email = 'apitest@example.com') {
  const res = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  return res.rows[0]?.id;
}

export async function createTestTask(userId: number, overrides = {}) {
  const defaults = {
    title: 'Fixture Task',
    description: 'Fixture Description',
    due_date: '2025-07-03',
  };
  const data = { ...defaults, ...overrides };
  const res = await db.query(
    'INSERT INTO tasks (user_id, title, description, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, data.title, data.description, data.due_date]
  );
  return res.rows[0];
}
