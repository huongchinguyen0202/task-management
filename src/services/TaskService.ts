import { Pool } from 'pg';
import { Task } from '../models/Task'; // Assume Task model/interface exists
import { validateTaskInput } from '../utils/validation'; // Assume validation utility exists

export class TaskService {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    // Helper: get priority_id from priority name
    async getPriorityIdByName(priority: string): Promise<number | null> {
        if (!priority) return null;
        const result = await this.db.query('SELECT id FROM priorities WHERE name = $1', [priority]);
        return result.rows[0]?.id || null;
    }

    // Helper: get priority name from id
    async getPriorityNameById(id: number): Promise<string | null> {
        if (!id) return null;
        const result = await this.db.query('SELECT name FROM priorities WHERE id = $1', [id]);
        return result.rows[0]?.name || null;
    }

    // Create a new task with validation and priority/due date handling
    async createTask(userId: number, taskData: Partial<Task>): Promise<Task> {
        validateTaskInput(taskData);

        const { title, description, due_date, priority } = taskData;
        let priority_id = taskData.priority_id;
        // Map priority string to id if needed
        if (!priority_id && priority) {
            priority_id = await this.getPriorityIdByName(priority as string);
        }
        if (!priority_id) {
            throw new Error('Invalid or missing priority');
        }
        if (due_date && new Date(due_date) < new Date()) {
            throw new Error('Due date cannot be in the past');
        }
        // Add status if it is present in taskData
        const hasStatus = "status" in taskData;
        const result = await this.db.query(
            `INSERT INTO tasks (user_id, title, description, due_date, priority_id${hasStatus ? ', status' : ''})
             VALUES ($1, $2, $3, $4, $5${hasStatus ? ', $6' : ''})
             RETURNING *`,
            hasStatus
                ? [userId, title, description, due_date, priority_id, (taskData as any).status]
                : [userId, title, description, due_date, priority_id]
        );
        const task = result.rows[0];
        task.priority = await this.getPriorityNameById(task.priority_id);
        return task;
    }

    // Get a single task by id and user
    async getTaskById(userId: number, taskId: number): Promise<Task | null> {
        const result = await this.db.query(
            `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
            [taskId, userId]
        );
        const task = result.rows[0] || null;
        if (task) {
            task.priority = await this.getPriorityNameById(task.priority_id);
        }
        return task;
    }

    // List all tasks for a user, optionally filter by priority or due date
    async listTasks(userId: number, filters?: { priority?: string; due_date?: string }): Promise<Task[]> {
        let query = `SELECT * FROM tasks WHERE user_id = $1`;
        const params: any[] = [userId];
        if (filters?.priority) {
            const priority_id = await this.getPriorityIdByName(filters.priority);
            if (priority_id) {
                params.push(priority_id);
                query += ` AND priority_id = $${params.length}`;
            }
        }
        if (filters?.due_date) {
            params.push(filters.due_date);
            query += ` AND due_date = $${params.length}`;
        }
        const result = await this.db.query(query, params);
        const tasks = result.rows;
        for (const task of tasks) {
            task.priority = await this.getPriorityNameById(task.priority_id);
        }
        return tasks;
    }

    // Get all tasks for a user, ordered by due date
    async getTasks(userId: number) {
        const result = await this.db.query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date ASC',
            [userId]
        );
        const tasks = result.rows;
        for (const task of tasks) {
            task.priority = await this.getPriorityNameById(task.priority_id);
        }
        return tasks;
    }

    // Update a task with validation and business logic
    async updateTask(userId: number, taskId: number, updates: Partial<Task>): Promise<Task | null> {
        if (updates.due_date && new Date(updates.due_date) < new Date()) {
            throw new Error('Due date cannot be in the past');
        }
        if (updates.priority && !updates.priority_id) {
            updates.priority_id = await this.getPriorityIdByName(updates.priority as string);
        }
        if (updates.priority) {
            delete updates.priority;
        }
        // Không xóa status, cho phép update status
        const fields = [];
        const values = [];
        let idx = 1;
        for (const key of Object.keys(updates)) {
            fields.push(`${key} = $${idx + 2}`);
            values.push((updates as any)[key]);
            idx++;
        }
        if (fields.length === 0) return null;
        const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = $1 AND user_id = $2 RETURNING *`;
        const result = await this.db.query(query, [taskId, userId, ...values]);
        const updated = result.rows[0] || null;
        if (updated) {
            updated.priority = await this.getPriorityNameById(updated.priority_id);
        }
        return updated;
    }

    // Delete a task
    async deleteTask(userId: number, taskId: number): Promise<boolean> {
        const result = await this.db.query(
            `DELETE FROM tasks WHERE id = $1 AND user_id = $2`,
            [taskId, userId]
        );
        return (result.rowCount ?? 0) > 0;
    }
}
