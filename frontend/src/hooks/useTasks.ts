import { useState, useCallback } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/client';
import type { Task } from '../types/task';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTasks();
      setTasks(res.data as Task[]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  return { tasks, loading, error, loadTasks };
}

export function useTaskOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTask = useCallback(async (task: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createTask(task);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editTask = useCallback(async (id: number, task: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateTask(id, task);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTask = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTask(id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addTask, editTask, removeTask, loading, error };
}
