import { query } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User'; // Assume User interface/model exists
import { validateUserInput, validatePassword } from '../utils/validation'; // Assume validation utilities exist

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export class UserService {
    // Register a new user
    async register(userData: Partial<User>): Promise<User> {
        try {
            validateUserInput(userData);
            const { email, password, username } = userData;
            if (!password) {
                throw new Error('Password is required');
            }
            const hash = await bcrypt.hash(password, 10);
            const result = await query(
                `INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING *`,
                [email, hash, username]
            );
            return result.rows[0];
        } catch (err) {
            console.error('UserService.register error:', err);
            throw err;
        }
    }

    // Authenticate user and return JWT token
    async authenticate(email: string, password: string): Promise<{ user: User; token: string }> {
        if (!email || !password) throw new Error('Email and password are required');
        validateUserInput({ email });

        const result = await query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );
        const user = result.rows[0];
        if (!user) throw new Error('Invalid credentials');

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) throw new Error('Invalid credentials');

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
        return { user, token };
    }

    // Get user profile by ID
    async getProfile(userId: number): Promise<User | null> {
        const result = await query(
            `SELECT id, email, created_at FROM users WHERE id = $1`,
            [userId]
        );
        return result.rows[0] || null;
    }

    // Update user profile (email)
    async updateProfile(userId: number, updates: Partial<User>): Promise<User | null> {
        if (updates.email) {
            validateUserInput({ email: updates.email });
        }
        const fields = [];
        const values = [];
        let idx = 1;
        for (const key of Object.keys(updates)) {
            if (key === 'password' || key === 'password_hash') continue;
            fields.push(`${key} = $${idx + 1}`);
            values.push((updates as any)[key]);
            idx++;
        }
        if (!fields.length) return this.getProfile(userId);

        const queryStr = `
            UPDATE users SET ${fields.join(', ')}
            WHERE id = $1
            RETURNING id, email, created_at`;
        const result = await query(queryStr, [userId, ...values]);
        return result.rows[0] || null;
    }

    // Change user password
    async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<boolean> {
        validatePassword(newPassword);
        const result = await query(
            `SELECT password_hash FROM users WHERE id = $1`,
            [userId]
        );
        const user = result.rows[0];
        if (!user) throw new Error('User not found');

        const match = await bcrypt.compare(oldPassword, user.password_hash);
        if (!match) throw new Error('Old password is incorrect');

        const newHash = await bcrypt.hash(newPassword, 10);
        await query(
            `UPDATE users SET password_hash = $1 WHERE id = $2`,
            [newHash, userId]
        );
        return true;
    }

    // Password reset: set new password by email (token logic can be added as needed)
    async resetPassword(email: string, newPassword: string): Promise<boolean> {
        validateUserInput({ email });
        validatePassword(newPassword);
        const hash = await bcrypt.hash(newPassword, 10);
        const result = await query(
            `UPDATE users SET password_hash = $1 WHERE email = $2`,
            [hash, email]
        );
        return (result.rowCount ?? 0) > 0;
    }
}
