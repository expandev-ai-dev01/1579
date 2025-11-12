import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import { taskService } from '../../services';
import type { UseCreateTaskOptions } from './types';
import type { CreateTaskDTO, Task } from '../../types';

/**
 * @hook useCreateTask
 * @summary Hook to create a new task.
 * @domain task
 * @type domain-hook
 * @category data
 */
export const useCreateTask = (options?: UseCreateTaskOptions) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options || {};

  const mutationOptions: UseMutationOptions<Task, Error, CreateTaskDTO, unknown> = {
    mutationFn: (data: CreateTaskDTO) => taskService.createTask(data),
    onSuccess: (data, variables, context) => {
      // Invalidate and refetch tasks list query
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess?.(data, variables, context);
    },
    ...restOptions,
  };

  return useMutation(mutationOptions);
};
