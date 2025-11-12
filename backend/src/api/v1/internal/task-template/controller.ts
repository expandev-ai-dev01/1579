import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CrudController, StatusGeneralError, successResponse } from '@/middleware/crud';
import { taskTemplateList } from '@/services/task';

const securable = 'TASK';

/**
 * @api {get} /internal/task-template List Task Templates
 * @apiName ListTaskTemplates
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves list of available task templates
 *
 * @apiSuccess {Array} templates Array of template objects
 *
 * @apiError {String} UnauthorizedError User lacks permission
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const emptySchema = z.object({});

  const [validated, error] = await operation.read(req, emptySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskTemplateList();

    res.json(successResponse(data));
  } catch (error: any) {
    next(StatusGeneralError);
  }
}
