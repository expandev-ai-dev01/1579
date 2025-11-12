import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/core/components/Button';
import { Input } from '@/core/components/Input';
import { Textarea } from '@/core/components/Textarea';
import { Select } from '@/core/components/Select';
import { useCreateTask } from '../../hooks';
import { createTaskSchema, CreateTaskDTO, Priority } from '../../types';
import type { TaskFormProps } from './types';

export const TaskForm = ({ onSuccess, onCancel }: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskDTO>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: undefined,
      priority: Priority.Medium,
    },
  });

  const { mutate: createTask, isPending } = useCreateTask({
    onSuccess: () => {
      reset();
      onSuccess?.();
    },
    onError: (error) => {
      // Here you would typically show a toast notification
      console.error('Failed to create task:', error);
      alert(`Error: ${error.message}`);
    },
  });

  const onSubmit = (data: CreateTaskDTO) => {
    const submissionData: CreateTaskDTO = {
      ...data,
      // react-hook-form sends empty strings for empty date inputs
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      priority: data.priority ? Number(data.priority) : Priority.Medium,
    };
    createTask(submissionData);
  };

  const priorityOptions = [
    { value: Priority.Low, label: 'Baixa' },
    { value: Priority.Medium, label: 'Média' },
    { value: Priority.High, label: 'Alta' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        id="title"
        label="Título"
        {...register('title')}
        error={errors.title?.message}
        required
      />
      <Textarea
        id="description"
        label="Descrição"
        {...register('description')}
        error={errors.description?.message}
        rows={4}
      />
      <Input
        id="dueDate"
        label="Data de Vencimento"
        type="date"
        {...register('dueDate', { valueAsDate: true })}
        error={errors.dueDate?.message}
      />
      <Select
        id="priority"
        label="Prioridade"
        options={priorityOptions}
        {...register('priority', { valueAsNumber: true })}
        error={errors.priority?.message}
      />
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isLoading={isPending} disabled={isPending}>
          Criar Tarefa
        </Button>
      </div>
    </form>
  );
};
