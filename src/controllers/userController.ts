import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { formatResponse } from '../utils/validation';
import db from '../db';

interface AuthenticatedRequest extends Request {
    user?: { id: number };
}

const userService = new UserService();

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Registering user:', req.body);
        const { email, password, username } = req.body;
        if (!email || typeof email !== 'string') {
            return res.status(400).json(formatResponse(null, 'A valid email is required', false));
        }
        if (!password || typeof password !== 'string') {
            return res.status(400).json(formatResponse(null, 'A valid password is required', false));
        }
        if (!username || typeof username !== 'string') {
            return res.status(400).json(formatResponse(null, 'A valid username is required', false));
        }
        const user = await userService.register({ email, password, username });
        res.status(201).json(formatResponse(user, 'User registered'));
    } catch (err) {
        next(err);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
            return res.status(400).json(formatResponse(null, 'Email and password are required', false));
        }
        const result = await userService.authenticate(email, password);
        res.json(formatResponse(result, 'Login successful'));
    } catch (err) {
        next(err);
    }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (typeof userId !== 'number') {
            return res.status(401).json(formatResponse(null, 'Unauthorized', false));
        }
        const user = await userService.getProfile(userId);
        if (!user) {
            return res.status(404).json(formatResponse(null, 'User not found', false));
        }
        res.json(formatResponse(user, 'Profile fetched'));
    } catch (err) {
        next(err);
    }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (typeof userId !== 'number') {
            return res.status(401).json(formatResponse(null, 'Unauthorized', false));
        }
        const updated = await userService.updateProfile(userId, req.body);
        if (!updated) {
            return res.status(404).json(formatResponse(null, 'User not found', false));
        }
        res.json(formatResponse(updated, 'Profile updated'));
    } catch (err) {
        next(err);
    }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { oldPassword, newPassword } = req.body;
        if (typeof userId !== 'number') {
            return res.status(401).json(formatResponse(null, 'Unauthorized', false));
        }
        if (!oldPassword || !newPassword) {
            return res.status(400).json(formatResponse(null, 'Old and new passwords are required', false));
        }
        await userService.changePassword(userId, oldPassword, newPassword);
        res.json(formatResponse(null, 'Password changed'));
    } catch (err) {
        next(err);
    }
};

// Dummy implementation for resetPassword
export const resetPassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Implement your logic here or return 501 Not Implemented
        return res.status(501).json({ success: false, message: 'Not implemented', data: null });
    } catch (err) {
        next(err);
    }
};
