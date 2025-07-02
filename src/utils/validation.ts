import { Task } from '../models/Task';
import { User } from '../models/User';

// Validate email format
function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate password strength (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
export function validatePassword(password: string) {
    if (typeof password !== 'string' || password.length < 8) {
        throw new Error('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
        throw new Error('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        throw new Error('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        throw new Error('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        throw new Error('Password must contain at least one special character');
    }
}

// Validate user input for registration and profile update
export function validateUserInput(user: Partial<User>) {
    console.log('Validating user input:', user);
    if (!user.email || typeof user.email !== 'string' || !isValidEmail(user.email)) {
        throw new Error('A valid email is required');
    }
    if (!user.username || typeof user.username !== 'string' || user.username.length < 3) {
        throw new Error('A valid username (min 3 chars) is required');
    }
    if ('password' in user && user.password !== undefined) {
        validatePassword(user.password);
    }
}

// Validate task input for creation and update
export function validateTaskInput(task: Partial<Task>) {
    if (!task.title || typeof task.title !== 'string' || task.title.trim().length === 0) {
        throw new Error('Task title is required');
    }
    if (task.title.length > 255) {
        throw new Error('Task title must be less than 255 characters');
    }
    if (task.description && typeof task.description !== 'string') {
        throw new Error('Task description must be a string');
    }
    if (task.due_date) {
        const due = new Date(task.due_date);
        if (isNaN(due.getTime())) {
            throw new Error('Invalid due date');
        }
    }
    if (task.priority_id && typeof task.priority_id !== 'number') {
        throw new Error('Priority ID must be a number');
    }
    if (task.category_id && typeof task.category_id !== 'number') {
        throw new Error('Category ID must be a number');
    }
}

// Utility to format API responses consistently
export function formatResponse(data: any, message: string, success: boolean = true) {
    return {
        success,
        message,
        data,
    };
}
