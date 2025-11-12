import { Router } from 'express';
import * as taskController from '@/api/v1/internal/task/controller';
import * as taskDetailController from '@/api/v1/internal/task/detail/controller';
import * as taskTemplateController from '@/api/v1/internal/task-template/controller';

const router = Router();

// Task routes
router.get('/task', taskController.getHandler);
router.post('/task', taskController.postHandler);
router.get('/task/:id', taskDetailController.getHandler);

// Task template routes
router.get('/task-template', taskTemplateController.getHandler);

export default router;
