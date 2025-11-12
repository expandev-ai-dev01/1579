import { authenticatedClient } from '@/core/lib/api';
import type { CreateTaskDTO, Task } from '../types';

/**
 * @service taskService
 * @summary Task management service for authenticated endpoints
 * @domain task
 * @type rest-service
 * @apiContext internal
 */
export const taskService = {
  /**
   * @endpoint POST /api/v1/internal/task
   * @summary Creates a new task.
   */
  async createTask(data: CreateTaskDTO): Promise<Task> {
    const response = await authenticatedClient.post('/task', data);
    return response.data.data;
  },
};
