export type TaskStatus = 'todo' | 'done';
export type TaskFilter = 'all' | TaskStatus;

export interface TaskDraft {
  title: string;
  description: string;
  dueDate?: string;
}

export interface Task extends TaskDraft {
  id: string;
  status: TaskStatus;
}
