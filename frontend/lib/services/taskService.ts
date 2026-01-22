import api from '../api';
import { Task, TaskFormData, ApiResponse } from '@/types';

interface GetTasksParams {
  status?: 'todo' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
}

/**
 * Get all tasks with optional filters
 */
export const getTasks = async (params?: GetTasksParams): Promise<Task[]> => {
  const queryParams = new URLSearchParams();
  
  if (params?.status) queryParams.append('status', params.status);
  if (params?.priority) queryParams.append('priority', params.priority);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const queryString = queryParams.toString();
  const url = `/tasks${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get<ApiResponse<{ tasks: Task[] }>>(url);
  // Backend returns data: { tasks: [...] }
  return response.data.data?.tasks || [];
};

/**
 * Get a single task by ID
 */
export const getTaskById = async (taskId: string): Promise<Task> => {
  const response = await api.get<ApiResponse<Task>>(`/tasks/${taskId}`);
  return response.data.data!;
};

/**
 * Create a new task
 */
export const createTask = async (taskData: TaskFormData): Promise<Task> => {
  const response = await api.post<ApiResponse<Task>>('/tasks', taskData);
  return response.data.data!;
};

/**
 * Update an existing task
 */
export const updateTask = async (
  taskId: string,
  taskData: Partial<TaskFormData>
): Promise<Task> => {
  const response = await api.put<ApiResponse<Task>>(`/tasks/${taskId}`, taskData);
  return response.data.data!;
};

/**
 * Delete a task
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};

/**
 * Get task statistics
 */
export const getTaskStats = async (): Promise<TaskStats> => {
  const response = await api.get<ApiResponse<TaskStats>>('/tasks/stats');
  return response.data.data!;
};
