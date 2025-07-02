import 'jest';
// @ts-nocheck
import { UserService } from '../UserService';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockQuery = jest.fn();
const mockPool = { query: mockQuery } as unknown as Pool;

const sampleUser = {
    id: 1,
    email: 'test@example.com',
    password_hash: 'hashed',
    created_at: new Date().toISOString(),
};

describe('UserService', () => {
    let service: UserService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new UserService(mockPool);
    });

    describe('register', () => {
        it('should register a user', async () => {
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
            mockQuery.mockResolvedValueOnce({ rows: [sampleUser] });
            const result = await service.register({ email: 'test@example.com', password: 'Password123!' });
            expect(result).toEqual(sampleUser);
        });

        it('should throw if email is invalid', async () => {
            await expect(service.register({ email: 'bad', password: 'Password123!' }))
                .rejects.toThrow('A valid email is required');
        });
    });

    describe('authenticate', () => {
        it('should authenticate and return token', async () => {
            mockQuery.mockResolvedValueOnce({ rows: [sampleUser] });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('token');
            const result = await service.authenticate('test@example.com', 'Password123!');
            expect(result.token).toBe('token');
            expect(result.user).toEqual(sampleUser);
        });

        it('should throw if user not found', async () => {
            mockQuery.mockResolvedValueOnce({ rows: [] });
            await expect(service.authenticate('notfound@example.com', 'Password123!'))
                .rejects.toThrow('Invalid credentials');
        });

        it('should throw if password does not match', async () => {
            mockQuery.mockResolvedValueOnce({ rows: [sampleUser] });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);
            await expect(service.authenticate('test@example.com', 'wrong'))
                .rejects.toThrow('Invalid credentials');
        });
    });

    describe('getProfile', () => {
        it('should return user profile', async () => {
            mockQuery.mockResolvedValueOnce({ rows: [sampleUser] });
            const result = await service.getProfile(1);
            expect(result).toEqual(sampleUser);
        });

        it('should return null if not found', async () => {
            mockQuery.mockResolvedValueOnce({ rows: [] });
            const result = await service.getProfile(999);
            expect(result).toBeNull();
        });
    });

    describe('updateProfile', () => {
        it('should update user profile', async () => {
            mockQuery.mockResolvedValueOnce({ rows: [sampleUser] });
            const result = await service.updateProfile(1, { email: 'new@example.com' });
            expect(result).toEqual(sampleUser);
        });

        it('should return null if update fails', async () => {
            mockQuery.mockResolvedValueOnce({ rows: [] });
            const result = await service.updateProfile(1, { email: 'new@example.com' });
            expect(result).toBeNull();
        });
    });

    describe('changePassword', () => {
        it('should change password if old password matches', async () => {
            mockQuery.mockResolvedValueOnce({ rows: [{ password_hash: 'hashed' }] });
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (bcrypt.hash as jest.Mock).mockResolvedValue('newhash');
            mockQuery.mockResolvedValueOnce({});
            const result = await service.changePassword(1, 'old', 'NewPassword123!');
            expect(result).toBe(true);
        });

        it('should throw if user not found', async () => {
            mockQuery.mockResolvedValueOnce({ rows: [] });
            await expect(service.changePassword(1, 'old', 'NewPassword123!'))
                .rejects.toThrow('User not found');
        });

        it('should throw if old password is incorrect', async () => {
            mockQuery.mockResolvedValueOnce({ rows: [{ password_hash: 'hashed' }] });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);
            await expect(service.changePassword(1, 'old', 'NewPassword123!'))
                .rejects.toThrow('Old password is incorrect');
        });
    });

    describe('resetPassword', () => {
        it('should reset password for existing email', async () => {
            (bcrypt.hash as jest.Mock).mockResolvedValue('newhash');
            mockQuery.mockResolvedValueOnce({ rowCount: 1 });
            const result = await service.resetPassword('test@example.com', 'NewPassword123!');
            expect(result).toBe(true);
        });

        it('should return false if user not found', async () => {
            (bcrypt.hash as jest.Mock).mockResolvedValue('newhash');
            mockQuery.mockResolvedValueOnce({ rowCount: 0 });
            const result = await service.resetPassword('notfound@example.com', 'NewPassword123!');
            expect(result).toBe(false);
        });
    });
});
