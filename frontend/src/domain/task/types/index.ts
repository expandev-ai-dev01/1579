import { z } from 'zod';

export enum Priority {
  Low = 0,
  Medium = 1,
  High = 2,
}

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres')
    .optional()
    .nullable(),
  dueDate: z
    .date()
    .min(
      new Date(new Date().setHours(0, 0, 0, 0)),
      'A data de vencimento deve ser igual ou posterior à data atual'
    )
    .optional()
    .nullable(),
  priority: z.nativeEnum(Priority).default(Priority.Medium).optional().nullable(),
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority: Priority;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}
