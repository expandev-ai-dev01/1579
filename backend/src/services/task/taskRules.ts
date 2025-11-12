import { getPool } from '@/instances/database';
import sql from 'mssql';
import {
  TaskCreateRequest,
  TaskListRequest,
  TaskListResponse,
  TaskGetResponse,
  TaskTemplate,
} from './taskTypes';

/**
 * @summary
 * Creates a new task with all specified attributes
 *
 * @function taskCreate
 * @module task
 *
 * @param {TaskCreateRequest} params - Task creation parameters
 *
 * @returns {Promise<{ idTask: number }>} Created task identifier
 *
 * @throws {Error} When validation fails or database operation fails
 */
export async function taskCreate(params: TaskCreateRequest): Promise<{ idTask: number }> {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('idUser', params.idUser)
    .input('title', params.title)
    .input('description', params.description || '')
    .input('dueDate', params.dueDate || null)
    .input('priority', params.priority ?? 1)
    .input('status', params.status ?? 0)
    .input(
      'recurrenceConfig',
      params.recurrenceConfig ? JSON.stringify(params.recurrenceConfig) : null
    )
    .input('estimatedHours', params.estimatedHours || null)
    .input('estimatedMinutes', params.estimatedMinutes || null)
    .input('tags', params.tags ? JSON.stringify(params.tags) : null)
    .input('subtasks', params.subtasks ? JSON.stringify(params.subtasks) : null)
    .execute('[functional].[spTaskCreate]');

  return result.recordset[0];
}

/**
 * @summary
 * Retrieves list of tasks with optional filtering
 *
 * @function taskList
 * @module task
 *
 * @param {TaskListRequest} params - List filter parameters
 *
 * @returns {Promise<TaskListResponse[]>} Array of tasks
 *
 * @throws {Error} When database operation fails
 */
export async function taskList(params: TaskListRequest): Promise<TaskListResponse[]> {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('idUser', params.idUser)
    .input('status', params.status || null)
    .input('priority', params.priority || null)
    .input('dueDateFrom', params.dueDateFrom || null)
    .input('dueDateTo', params.dueDateTo || null)
    .execute('[functional].[spTaskList]');

  return result.recordset;
}

/**
 * @summary
 * Retrieves complete task details with related data
 *
 * @function taskGet
 * @module task
 *
 * @param {object} params - Get parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idTask - Task identifier
 *
 * @returns {Promise<TaskGetResponse>} Complete task details
 *
 * @throws {Error} When task not found or database operation fails
 */
export async function taskGet(params: {
  idAccount: number;
  idTask: number;
}): Promise<TaskGetResponse> {
  const pool = await getPool();

  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('idTask', params.idTask)
    .execute('[functional].[spTaskGet]');

  const recordsets = result.recordsets as sql.IRecordSet<any>[];

  const task = recordsets[0][0];
  const tags = recordsets[1].map((row: any) => row.tag);
  const attachments = recordsets[2];
  const subtasks = recordsets[3];

  if (task.recurrenceConfig) {
    task.recurrenceConfig = JSON.parse(task.recurrenceConfig);
  }

  return {
    task,
    tags,
    attachments,
    subtasks,
  };
}

/**
 * @summary
 * Retrieves list of available task templates
 *
 * @function taskTemplateList
 * @module task
 *
 * @returns {Promise<TaskTemplate[]>} Array of task templates
 *
 * @throws {Error} When database operation fails
 */
export async function taskTemplateList(): Promise<TaskTemplate[]> {
  const pool = await getPool();

  const result = await pool.request().execute('[functional].[spTaskTemplateList]');

  return result.recordset.map((row: any) => ({
    idTemplate: row.idTemplate,
    name: row.name,
    templateData: JSON.parse(row.templateData),
  }));
}
