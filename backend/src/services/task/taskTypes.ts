/**
 * @interface TaskEntity
 * @description Represents a task entity in the system
 *
 * @property {number} idTask - Unique task identifier
 * @property {number} idAccount - Associated account identifier
 * @property {number} idUser - User identifier who created the task
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {string | null} dueDate - Task due date (ISO date string)
 * @property {number} priority - Task priority (0=Low, 1=Medium, 2=High)
 * @property {number} status - Task status (0=Pending, 1=Draft, 2=Completed)
 * @property {string | null} recurrenceConfig - JSON recurrence configuration
 * @property {number | null} estimatedHours - Estimated hours for completion
 * @property {number | null} estimatedMinutes - Estimated minutes for completion
 * @property {Date} dateCreated - Creation timestamp
 * @property {Date} dateModified - Last modification timestamp
 */
export interface TaskEntity {
  idTask: number;
  idAccount: number;
  idUser: number;
  title: string;
  description: string;
  dueDate: string | null;
  priority: number;
  status: number;
  recurrenceConfig: string | null;
  estimatedHours: number | null;
  estimatedMinutes: number | null;
  dateCreated: Date;
  dateModified: Date;
}

/**
 * @interface TaskCreateRequest
 * @description Request parameters for creating a new task
 */
export interface TaskCreateRequest {
  idAccount: number;
  idUser: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: number;
  status?: number;
  recurrenceConfig?: RecurrenceConfig;
  estimatedHours?: number;
  estimatedMinutes?: number;
  tags?: string[];
  subtasks?: string[];
}

/**
 * @interface RecurrenceConfig
 * @description Configuration for recurring tasks
 */
export interface RecurrenceConfig {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
}

/**
 * @interface TaskListRequest
 * @description Request parameters for listing tasks
 */
export interface TaskListRequest {
  idAccount: number;
  idUser: number;
  status?: number;
  priority?: number;
  dueDateFrom?: string;
  dueDateTo?: string;
}

/**
 * @interface TaskListResponse
 * @description Response format for task list
 */
export interface TaskListResponse {
  idTask: number;
  title: string;
  description: string;
  dueDate: string | null;
  priority: number;
  status: number;
  estimatedHours: number | null;
  estimatedMinutes: number | null;
  tagCount: number;
  subtaskCount: number;
  completedSubtaskCount: number;
  dateCreated: Date;
  dateModified: Date;
}

/**
 * @interface TaskGetResponse
 * @description Complete task details with related data
 */
export interface TaskGetResponse {
  task: TaskEntity;
  tags: string[];
  attachments: TaskAttachment[];
  subtasks: Subtask[];
}

/**
 * @interface TaskAttachment
 * @description Task attachment information
 */
export interface TaskAttachment {
  idAttachment: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  dateCreated: Date;
}

/**
 * @interface Subtask
 * @description Subtask information
 */
export interface Subtask {
  idSubtask: number;
  title: string;
  status: number;
  sortOrder: number;
  dateCreated: Date;
}

/**
 * @interface TaskTemplate
 * @description Task template information
 */
export interface TaskTemplate {
  idTemplate: number;
  name: string;
  templateData: TaskTemplateData;
}

/**
 * @interface TaskTemplateData
 * @description Template data structure
 */
export interface TaskTemplateData {
  title: string;
  description?: string;
  priority?: number;
  estimatedHours?: number;
  estimatedMinutes?: number;
  tags?: string[];
}

/**
 * @enum TaskPriority
 * @description Task priority levels
 */
export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

/**
 * @enum TaskStatus
 * @description Task status values
 */
export enum TaskStatus {
  Pending = 0,
  Draft = 1,
  Completed = 2,
}
