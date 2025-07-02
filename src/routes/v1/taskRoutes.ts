import express from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../../controllers/taskController';
import { authenticateJWT } from '../../middleware/auth';

const router = express.Router();

// All task routes require authentication
router.use(authenticateJWT);

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
