import { clearTestUsers, clearTestTasks, createTestUser, getTestUserId, createTestTask } from '../../utils/testUtils';

describe('Test Utilities', () => {
  it('should clear test users and tasks', async () => {
    await clearTestUsers();
    await clearTestTasks();
    // No error means success
  });

  it('should create and fetch a test user', async () => {
    const userId = await createTestUser('apitest2@example.com');
    const fetchedId = await getTestUserId('apitest2@example.com');
    expect(typeof fetchedId).toBe('number');
  });

  it('should create a test task', async () => {
    await createTestUser('apitest3@example.com');
    const userId = await getTestUserId('apitest3@example.com');
    const task = await createTestTask(userId, { title: 'Custom Title' });
    expect(task.title).toBe('Custom Title');
  });
});
