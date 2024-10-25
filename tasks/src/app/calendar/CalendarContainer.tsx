'use client';

import { useState } from 'react';
import { Task } from '@/types/db';
import CalendarView from '@/components/calendar/CalendarView';
import { CreateTaskDialog } from '@/components/tasks/CreateDialog';
import { logger } from '@/lib/logger/logger';

interface CalendarContainerProps {
  tasks: Task[];
}

export function CalendarContainer({ tasks }: CalendarContainerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleTaskCreate = (startDate: Date) => {
    setSelectedDate(startDate);
    setIsCreateDialogOpen(true);
  };

  const handleTaskUpdate = async (taskId: number, newDate: Date) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ due_date: newDate }),
      });

      if (!response.ok) throw new Error('Failed to update task');
      
      // You might want to add a refresh mechanism here
    } catch (error) {
      logger.error(error as Error, { 
        context: 'CalendarContainer.handleTaskUpdate',
        taskId,
        newDate 
      });
    }
  };

  const handleTaskSelect = (taskId: number) => {
    // Handle task selection - you might want to open a detail dialog
    console.log('Selected task:', taskId);
  };

  return (
    <>
      <CalendarView
        tasks={tasks}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskSelect={handleTaskSelect}
      />

      <CreateTaskDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        // Removed initialDate as it is not a valid prop
      />
    </>
  );
}