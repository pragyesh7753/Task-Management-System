import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  getAllTasks,
  createNewTask,
  getTask,
  updateExistingTask,
  deleteExistingTask,
  toggleTask,
} from '../controllers/task.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getAllTasks);
router.post('/', createNewTask);
router.get('/:id', getTask);
router.patch('/:id', updateExistingTask);
router.delete('/:id', deleteExistingTask);
router.patch('/:id/toggle', toggleTask);

export default router;
