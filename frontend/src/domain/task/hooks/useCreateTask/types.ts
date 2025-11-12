import { UseMutationOptions } from '@tanstack/react-query';
import { CreateTaskDTO, Task } from '../../types';

export type UseCreateTaskOptions = Omit<
  UseMutationOptions<Task, Error, CreateTaskDTO, unknown>,
  'onSuccess'
> & {
  onSuccess?: (data: Task, variables: CreateTaskDTO, context: unknown) => unknown;
};
