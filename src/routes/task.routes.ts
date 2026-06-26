import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { asyncHandler } from '../lib/async-handler';

const router = Router();

router.get('/', asyncHandler(taskController.list));
router.post('/', asyncHandler(taskController.create));
router.get('/:id', asyncHandler(taskController.get));
router.put('/:id', asyncHandler(taskController.update));
router.patch('/:id/status', asyncHandler(taskController.updateStatus));
router.delete('/:id', asyncHandler(taskController.remove));

export default router;
