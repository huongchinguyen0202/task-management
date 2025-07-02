import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/client';
import type { Task } from '../types/task';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error?: string;
  fetchAll: () => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  editTask: (id: number, task: Partial<Task>) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
  filter: string;
  setFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortDir: 'asc' | 'desc';
  setSortDir: (dir: 'asc' | 'desc') => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

function taskReducer(state: any, action: any) {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t: Task) => t.id === action.payload.id ? action.payload : t),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t: Task) => t.id !== action.payload) };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'SET_SORT_DIR':
      return { ...state, sortDir: action.payload };
    default:
      return state;
  }
}

const initialState = {
  tasks: [],
  loading: false,
  error: undefined,
  filter: '',
  sortBy: 'createdAt',
  sortDir: 'asc',
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchAll = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await fetchTasks();
      dispatch({ type: 'SET_TASKS', payload: res.data });
      dispatch({ type: 'SET_ERROR', payload: undefined });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || 'Failed to fetch tasks' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const addTask = useCallback(async (task: Partial<Task>) => {
    // Optimistic update
    const tempId = Date.now();
    const optimisticTask = { ...task, id: tempId } as Task;
    dispatch({ type: 'ADD_TASK', payload: optimisticTask });
    try {
      const res = await createTask(task);
      dispatch({ type: 'UPDATE_TASK', payload: res.data });
    } catch (err: any) {
      dispatch({ type: 'DELETE_TASK', payload: tempId });
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || 'Failed to add task' });
    }
  }, []);

  const editTask = useCallback(async (id: number, task: Partial<Task>) => {
    // Optimistic update
    const prevTask = state.tasks.find((t: Task) => t.id === id);
    if (!prevTask) return;
    const optimisticTask = { ...prevTask, ...task };
    dispatch({ type: 'UPDATE_TASK', payload: optimisticTask });
    try {
      const res = await updateTask(id, task);
      dispatch({ type: 'UPDATE_TASK', payload: res.data });
    } catch (err: any) {
      dispatch({ type: 'UPDATE_TASK', payload: prevTask });
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || 'Failed to update task' });
    }
  }, [state.tasks]);

  const removeTask = useCallback(async (id: number) => {
    // Optimistic update
    const prevTasks = state.tasks;
    dispatch({ type: 'DELETE_TASK', payload: id });
    try {
      await deleteTask(id);
    } catch (err: any) {
      dispatch({ type: 'SET_TASKS', payload: prevTasks });
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message || 'Failed to delete task' });
    }
  }, [state.tasks]);

  const setFilter = (filter: string) => dispatch({ type: 'SET_FILTER', payload: filter });
  const setSortBy = (sortBy: string) => dispatch({ type: 'SET_SORT_BY', payload: sortBy });
  const setSortDir = (dir: 'asc' | 'desc') => dispatch({ type: 'SET_SORT_DIR', payload: dir });

  // Memoize filtered and sorted tasks for consumers
  const filteredSortedTasks = useMemo(() => {
    let filtered = state.tasks;
    if (state.filter) filtered = filtered.filter((t: Task) => t.title.toLowerCase().includes(state.filter.toLowerCase()));
    filtered = [...filtered].sort((a: Task, b: Task) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (state.sortBy === 'createdAt') {
        aVal = a.createdAt || a.created_at || '';
        bVal = b.createdAt || b.created_at || '';
      } else if (state.sortBy === 'dueDate') {
        aVal = a.dueDate || a.due_date || '';
        bVal = b.dueDate || b.due_date || '';
      } else if (state.sortBy === 'title') {
        aVal = a.title;
        bVal = b.title;
      }
      if (aVal < bVal) return state.sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return state.sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [state.tasks, state.filter, state.sortBy, state.sortDir]);

  return (
    <TaskContext.Provider
      value={{
        tasks: filteredSortedTasks,
        loading: state.loading,
        error: state.error,
        fetchAll,
        addTask,
        editTask,
        removeTask,
        filter: state.filter,
        setFilter,
        sortBy: state.sortBy,
        setSortBy,
        sortDir: state.sortDir,
        setSortDir,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
  return ctx;
};
