import { Suspense } from 'react';
import { db } from '@/lib/db/db';
import { authenticate } from '@/lib/auth';
import { CalendarContainer } from './CalendarContainer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { logger } from '@/lib/logger/logger';

async function getTasks() {
  const user = await authenticate();
  if (!user) {
    const error = new Error('User authentication failed');
    logger.error(error, { context: 'calendar/getTasks' });
    throw error;
  }
  try {
    return db.tasks.getByAssignee(user.id);
  } catch (error) {
    logger.error(error as Error, { context: 'calendar/getTasks' });
    throw error;
  }
}

export default async function CalendarPage() {
  const tasks = await getTasks();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage tasks and deadlines in calendar view
          </p>
        </div>
      </div>

      <Suspense fallback={<LoadingSpinner size="lg" />}>
        <CalendarContainer tasks={tasks} />
      </Suspense>
    </div>
  );
}