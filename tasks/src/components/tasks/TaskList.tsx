'use client';

import { useState, useEffect } from 'react';
import { TaskCard } from './TaskCard';  // Import TaskCard instead of Card
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { logger } from '@/lib/logger/logger';
import type { Task } from '@/types/db';

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/tasks');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch tasks');
      }

      setTasks(result.data || []);
      
    } catch (error) {
      logger.error(error as Error, { context: 'TaskList.fetchTasks' });
      setError(error instanceof Error ? error.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskChange = () => {
    fetchTasks();
  };

  return (
    <div className="space-y-4">
      {loading && (
        <div className="fixed bottom-4 right-4 bg-white rounded-full shadow-lg p-2">
          <LoadingSpinner size="sm" />
        </div>
      )}
      
      {tasks.map((task) => (
        <TaskCard  // Using TaskCard instead of Card
          key={task.id}
          task={task}
          onUpdate={handleTaskChange}
          onDelete={handleTaskChange}
        />
      ))}
    </div>
  );
}