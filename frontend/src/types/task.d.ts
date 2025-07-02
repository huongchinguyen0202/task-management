export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  dueDate?: string; // ISO string
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string
  userId?: number;
  priority?: 'low' | 'medium' | 'high';
  // legacy fields for compatibility
  due_date?: string;
  completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  message?: string;
}

// Auth response
export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

// Component props
export interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export interface TaskFormProps {
  initialTask?: Task;
  onSubmit: (task: Partial<Task>) => void;
  loading?: boolean;
}

// State interfaces
export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error?: string;
}

export interface AuthState {
  user: null | { id: number; username: string; email: string };
  token: string | null;
  loading: boolean;
  error?: string;
}
