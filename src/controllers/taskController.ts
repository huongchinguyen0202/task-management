import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/TaskService';
import { Pool } from 'pg';
import db from '../db'; // Assumes you have a default export for db in db.ts
import { formatResponse } from '../utils/validation';

// Extend Express Request to include user property
interface AuthenticatedRequest extends Request {
    user?: { id: number };
}
const taskService = new TaskService(db);

export const createTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { title, description, due_date, priority, status } = req.body; // Lấy priority và status từ body
        if (!title || typeof title !== 'string') {
            return res.status(400).json(formatResponse(null, 'Title is required', false));
        }
        const userId = req.user?.id;
        if (typeof userId !== 'number') {
            return res.status(401).json(formatResponse(null, 'Unauthorized', false));
        }
        // Truyền priority và status vào service để mapping tự động
        const task = await taskService.createTask(userId, { title, description, due_date, priority, status });
        res.status(201).json(formatResponse(task, 'Task created'));
    } catch (err) {
        next(err);
    }
};

export const getTasks = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (typeof userId !== 'number') {
            return res.status(401).json(formatResponse(null, 'Unauthorized', false));
        }
        const tasks = await taskService.getTasks(userId);
        // Đảm bảo trả về priority là string cho frontend
        res.json(formatResponse(tasks, 'Tasks fetched'));
    } catch (err) {
        next(err);
    }
};

export const getTaskById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (typeof userId !== 'number') {
            return res.status(401).json(formatResponse(null, 'Unauthorized', false));
        }
        const taskId = Number(req.params.id);
        const task = await taskService.getTaskById(userId, taskId);
        if (!task) {
            return res.status(404).json(formatResponse(null, 'Task not found', false));
        }
        res.json(formatResponse(task, 'Task fetched'));
    } catch (err) {
        next(err);
    }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (typeof userId !== 'number') {
            return res.status(401).json(formatResponse(null, 'Unauthorized', false));
        }
        const taskId = Number(req.params.id);
        // Truyền priority string nếu có để service mapping tự động
        const updated = await taskService.updateTask(userId, taskId, req.body);
        if (!updated) {
            return res.status(404).json(formatResponse(null, 'Task not found', false));
        }
        res.json(formatResponse(updated, 'Task updated'));
    } catch (err) {
        next(err);
    }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (typeof userId !== 'number') {
            return res.status(401).json(formatResponse(null, 'Unauthorized', false));
        }
        const taskId = Number(req.params.id);
        const deleted = await taskService.deleteTask(userId, taskId);
        if (!deleted) {
            return res.status(404).json(formatResponse(null, 'Task not found', false));
        }
        res.json(formatResponse(null, 'Task deleted'));
    } catch (err) {
        next(err);
    }
};
