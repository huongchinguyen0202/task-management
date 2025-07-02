import { Pool } from 'pg';
import { Task } from '../models/Task'; // Assume Task model/interface exists
import { validateTaskInput } from '../utils/validation'; // Assume validation utility exists

export class TaskService {
    private db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    // Create a new task with validation and priority/due date handling
    async createTask(userId: number, taskData: Partial<Task>): Promise<Task> {
        validateTaskInput(taskData);

        const { title, description, due_date, priority_id, category_id } = taskData;

        // Example: Enforce due_date is not in the past
        if (due_date && new Date(due_date) < new Date()) {
            throw new Error('Due date cannot be in the past');
        }

        const result = await this.db.query(
            `INSERT INTO tasks (user_id, title, description, due_date, priority_id, category_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [userId, title, description, due_date, priority_id, category_id]
        );
        return result.rows[0];
    }

    // Get a single task by id and user
    async getTaskById(userId: number, taskId: number): Promise<Task | null> {
        const result = await this.db.query(
            `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
            [taskId, userId]
        );
        return result.rows[0] || null;
    }

    // List all tasks for a user, optionally filter by priority or due date
    async listTasks(userId: number, filters?: { priority_id?: number; due_date?: string }): Promise<Task[]> {
        let query = `SELECT * FROM tasks WHERE user_id = $1`;
        const params: any[] = [userId];
        if (filters?.priority_id) {
            params.push(filters.priority_id);
            query += ` AND priority_id = $${params.length}`;
        }
        if (filters?.due_date) {
            params.push(filters.due_date);
            query += ` AND due_date = $${params.length}`;
        }
        const result = await this.db.query(query, params);
        return result.rows;
    }

    // Get all tasks for a user, ordered by due date
    async getTasks(userId: number) {
        const result = await this.db.query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date ASC',
            [userId]
        );
        return result.rows;
    }

    // Update a task with validation and business logic
    async updateTask(userId: number, taskId: number, updates: Partial<Task>): Promise<Task | null> {
        if (updates.due_date && new Date(updates.due_date) < new Date()) {
            throw new Error('Due date cannot be in the past');
        }
        // ...additional validation as needed...

        // Build dynamic update query
        const fields = [];
        const values = [];
        let idx = 1;
        for (const key of Object.keys(updates)) {
            fields.push(`${key} = $${idx + 2}`);
            values.push((updates as any)[key]);
            idx++;
        }
        if (!fields.length) return this.getTaskById(userId, taskId);

        const query = `
            UPDATE tasks SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND user_id = $2
            RETURNING *`;
        const result = await this.db.query(query, [taskId, userId, ...values]);
        return result.rows[0] || null;
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
