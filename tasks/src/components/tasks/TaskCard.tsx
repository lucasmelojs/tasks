import { format } from 'date-fns';
import { logger } from '@/lib/logger/logger';
import type { Task } from '@/types/db';

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
  // Debug log when task card renders
  logger.debug('Rendering TaskCard:', { taskId: task.id, title: task.title });

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
      </div>
    </div>
  );
}