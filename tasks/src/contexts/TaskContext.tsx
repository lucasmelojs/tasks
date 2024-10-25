'use client'
import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { Task } from '@/types/db';
import { logger } from '@/lib/logger/logger';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  loading: false,
  error: null,
  fetchTasks: async () => {},
});

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (error) {
      logger.error(error as Error, { context: 'TaskContext' });
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch when component mounts
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Set up polling interval (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTasks();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchTasks]);

  const value = {
    tasks,
    loading,
    error,
    fetchTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);