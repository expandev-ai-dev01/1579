import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { taskCreate, taskList, taskGet } from '@/services/task';

const securable = 'TASK';

/**
 * @api {post} /internal/task Create Task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task with specified parameters
 *
 * @apiParam {String} title Task title (3-100 characters)
 * @apiParam {String} [description] Task description (max 1000 characters)
 * @apiParam {String} [dueDate] Due date (ISO date format, must be today or future)
 * @apiParam {Number} [priority] Priority level (0=Low, 1=Medium, 2=High)
 * @apiParam {Number} [status] Status (0=Pending, 1=Draft, 2=Completed)
 * @apiParam {Object} [recurrenceConfig] Recurrence configuration
 * @apiParam {Number} [estimatedHours] Estimated hours (0-999)
 * @apiParam {Number} [estimatedMinutes] Estimated minutes (0-59)
 * @apiParam {Array} [tags] Array of tags (max 5, 2-20 chars each)
 * @apiParam {Array} [subtasks] Array of subtask titles (max 20)
 *
 * @apiSuccess {Number} idTask Created task identifier
 *
 * @apiError {String} titleRequired Title is required
 * @apiError {String} titleTooShort Title must be at least 3 characters
 * @apiError {String} titleTooLong Title must be at most 100 characters
 * @apiError {String} dueDateInPast Due date cannot be in the past
 * @apiError {String} tooManyTags Maximum 5 tags allowed
 * @apiError {String} tooManySubtasks Maximum 20 subtasks allowed
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const recurrenceSchema = z
    .object({
      type: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
      interval: z.number().int().positive(),
      endDate: z.string().optional(),
    })
    .optional();

  const bodySchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().max(1000).optional(),
    dueDate: z.string().optional(),
    priority: z.number().int().min(0).max(2).optional(),
    status: z.number().int().min(0).max(2).optional(),
    recurrenceConfig: recurrenceSchema,
    estimatedHours: z.number().int().min(0).max(999).optional(),
    estimatedMinutes: z.number().int().min(0).max(59).optional(),
    tags: z.array(z.string().min(2).max(20)).max(5).optional(),
    subtasks: z.array(z.string().min(3).max(100)).max(20).optional(),
  });

  const [validated, error] = await operation.create(req, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskCreate({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {get} /internal/task List Tasks
 * @apiName ListTasks
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves list of tasks with optional filtering
 *
 * @apiParam {Number} [status] Filter by status
 * @apiParam {Number} [priority] Filter by priority
 * @apiParam {String} [dueDateFrom] Filter by due date from (ISO date)
 * @apiParam {String} [dueDateTo] Filter by due date to (ISO date)
 *
 * @apiSuccess {Array} tasks Array of task objects
 *
 * @apiError {String} UnauthorizedError User lacks permission
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const querySchema = z.object({
    status: z.coerce.number().int().min(0).max(2).optional(),
    priority: z.coerce.number().int().min(0).max(2).optional(),
    dueDateFrom: z.string().optional(),
    dueDateTo: z.string().optional(),
  });

  const [validated, error] = await operation.read(req, querySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskList({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    next(StatusGeneralError);
  }
}
