export type TaskStatus = 'PENDING' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TasksResponse {
  data: Task[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateTaskData {
  title: string;
  description?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
