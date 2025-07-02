import 'jest';
// @ts-nocheck
import { TaskService } from '../TaskService';
import { Pool } from 'pg';

const mockQuery = jest.fn();
const mockPool = { query: mockQuery } as unknown as Pool;

const sampleTask = {
    id: 1,
    user_id: 1,
    title: 'Test Task',
    description: 'Test Desc',
    due_date: '2099-12-31',
    priority_id: 1,
    category_id: 1,
    completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

describe('TaskService', () => {
    let service: TaskService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new TaskService(mockPool);
    });

    describe('createTask', () => {
        it('should create a task successfully', async () => {
            mockQuery.mockResolvedValueOnce({ rows: [sampleTask] });
            const result = await service.createTask(1, {
                title: 'Test Task',
                description: 'Test Desc',
                due_date: '2099-12-31',
                priority_id: 1,
                category_id: 1,
            });
            expect(result).toEqual(sampleTask);
            expect(mockQuery).toHaveBeenCalled();
        });

        it('should throw if due_date is in the past', async () => {
            await expect(
                service.createTask(1, { title: 'T', due_date: '2000-01-01' })
            ).rejects.toThrow('Due date cannot be in the past');
        });

        it('should throw if title is missing', async () => {
            await expect(
                service.createTask(1, { description: 'No title' })
            ).rejects.toThrow('Task title is required');
        });
    });

    describe('getTaskById', () => {
        it('should return a task if found', async () => {
            mockQuery.mockResolvedValueOnce({ rows: [sampleTask] });
            const result = await service.getTaskById(1, 1);
            expect(result).toEqual(sampleTask);
        });

        it('should return null if not found', async () => {
            mockQuery.mockResolvedValueOnce({ rows: [] });
            const result = await service.getTaskById(1, 999);
            expect(result).toBeNull();
        });
    });

    describe('listTasks', () => {
        it('should return tasks for a user', async () => {
            mockQuery.mockResolvedValueOnce({ rows: [sampleTask] });
            const result = await service.listTasks(1);
            expect(result).toEqual([sampleTask]);
        });
    });

    describe('updateTask', () => {
        it('should update a task', async () => {
            mockQuery.mockResolvedValueOnce({ rows: [sampleTask] });
            const result = await service.updateTask(1, 1, { title: 'Updated' });
            expect(result).toEqual(sampleTask);
        });

        it('should throw if due_date is in the past', async () => {
            await expect(
                service.updateTask(1, 1, { due_date: '2000-01-01' })
            ).rejects.toThrow('Due date cannot be in the past');
        });

        it('should return null if update fails', async () => {
            mockQuery.mockResolvedValueOnce({ rows: [] });
            const result = await service.updateTask(1, 1, { title: 'Updated' });
            expect(result).toBeNull();
        });
    });

    describe('deleteTask', () => {
        it('should return true if deleted', async () => {
            mockQuery.mockResolvedValueOnce({ rowCount: 1 });
            const result = await service.deleteTask(1, 1);
            expect(result).toBe(true);
        });

        it('should return false if not deleted', async () => {
            mockQuery.mockResolvedValueOnce({ rowCount: 0 });
            const result = await service.deleteTask(1, 1);
            expect(result).toBe(false);
        });
    });
});

