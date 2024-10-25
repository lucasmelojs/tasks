'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Task } from '@/types/db';
import { logger } from '@/lib/logger/logger';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export function TaskCard({ task, onUpdate }: TaskCardProps) {
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus: Task['status']) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update task');
      onUpdate();
    } catch (error) {
      logger.error(error as Error, { context: 'TaskCard', taskId: task.id });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{task.description}</p>
        </div>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
            {task.status}
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex space-x-4 text-sm text-gray-500">
          <span>Due: {format(new Date(task.due_date), 'MMM d, yyyy')}</span>
          <span>Assigned to: {task.assigned_to}</span>
        </div>
        
        <div className="flex space-x-2">
          {task.status !== 'completed' && (
            <button
              onClick={() => handleStatusUpdate('completed')}
              disabled={updating}
              className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Complete
            </button>
          )}
          {task.status === 'pending' && (
            <button
              onClick={() => handleStatusUpdate('in_progress')}
              disabled={updating}
              className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Start
            </button>
          )}
        </div>
      </div>
    </div>
  );
}