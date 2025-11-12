import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { taskGet } from '@/services/task';

const securable = 'TASK';

/**
 * @api {get} /internal/task/:id Get Task Details
 * @apiName GetTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves complete task details including tags, attachments, and subtasks
 *
 * @apiParam {Number} id Task identifier
 *
 * @apiSuccess {Object} task Task details
 * @apiSuccess {Array} tags Array of tag strings
 * @apiSuccess {Array} attachments Array of attachment objects
 * @apiSuccess {Array} subtasks Array of subtask objects
 *
 * @apiError {String} taskNotFound Task not found
 * @apiError {String} UnauthorizedError User lacks permission
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const paramsSchema = z.object({
    id: z.coerce.number().int().positive(),
  });

  const [validated, error] = await operation.read(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskGet({
      idAccount: validated.credential.idAccount,
      idTask: validated.params.id,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(404).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
