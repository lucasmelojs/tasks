'use client';
import { useEffect, useState } from 'react';
import { Task } from '@/types/db';
import { logger } from '@/lib/logger/logger';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { TaskCard } from './TaskCard';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      logger.debug('Fetching tasks...');
      
      const response = await fetch('/api/tasks');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch tasks');
      }

      // Access tasks through the data property
      const tasks = result.data;
      logger.debug('Tasks received:', { count: tasks.length });
      
      setTasks(tasks);
      setError(null);
    } catch (error) {
      logger.error(error as Error, { context: 'TaskList' });
      setError(error instanceof Error ? error.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={fetchTasks}
          className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-500">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onUpdate={fetchTasks}
        />
      ))}
    </div>
  );
}
