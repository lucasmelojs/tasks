import { TaskList } from '@/components/tasks/TaskList';
import { TaskStats } from '@/components/tasks/TaskStats';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your tasks and team activity
        </p>
      </div>

      <TaskStats />
      
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Tasks</h2>
        <TaskList />
      </div>
    </div>
  );
}