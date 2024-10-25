'use client';

import { useEffect, useState } from 'react';
import { TaskStats as TaskStatsType } from '@/types/db';
import { logger } from '@/lib/logger/logger';

export function TaskStats() {
  const [stats, setStats] = useState<TaskStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/tasks/stats');
      if (!response.ok) throw new Error('Failed to fetch task statistics');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      logger.error(error as Error, { context: 'TaskStats' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
      ))}
    </div>;
  }

  if (!stats) return null;

  const statCards = [
    { title: 'Total Tasks', value: stats.total, bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { title: 'In Progress', value: stats.in_progress, bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
    { title: 'Completed', value: stats.completed, bgColor: 'bg-green-50', textColor: 'text-green-600' },
    { title: 'Overdue', value: stats.overdue, bgColor: 'bg-red-50', textColor: 'text-red-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.title}
          className={`${stat.bgColor} rounded-lg p-5 shadow-sm`}
        >
          <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
          <p className={`mt-1 text-3xl font-semibold ${stat.textColor}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}