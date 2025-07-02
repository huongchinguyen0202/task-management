import { Router } from 'express';
import { authenticateJWT } from '../../middleware/auth';
import {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    resetPassword
} from '../../controllers/userController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);

// Ép kiểu authenticateJWT về any để tránh lỗi kiểu
router.get('/profile', authenticateJWT as any, getProfile);
router.put('/profile', authenticateJWT as any, updateProfile);
router.post('/change-password', authenticateJWT as any, changePassword);

export default router;
