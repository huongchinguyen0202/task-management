import { Router } from 'express';
import taskRoutes from './taskRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);

export default router;
