import { Suspense } from 'react';
import { TaskList } from '@/components/tasks/TaskList';
import { CreateTaskButton } from '@/components/tasks/CreateTaskButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track your team's tasks
          </p>
        </div>
        <CreateTaskButton />
      </div>

      <Suspense fallback={<LoadingSpinner size="lg" />}>
        <TaskList />
      </Suspense>
    </div>
  );
}