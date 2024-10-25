'use client';

import { useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateSelectArg, EventDropArg, EventClickArg } from '@fullcalendar/core';
import { Task } from '@/types/db';
import { logger } from '@/lib/logger/logger';

interface CalendarViewProps {
  tasks: Task[];
  onTaskCreate?: (startDate: Date) => void;
  onTaskUpdate?: (taskId: number, newDate: Date) => void;
  onTaskSelect?: (taskId: number) => void;
}

export default function CalendarView({ 
  tasks, 
  onTaskCreate, 
  onTaskUpdate,
  onTaskSelect 
}: CalendarViewProps) {
  // Convert tasks to calendar events
  const events = tasks.map(task => ({
    id: task.id.toString(),
    title: task.title,
    start: new Date(task.due_date),
    backgroundColor: getPriorityColor(task.priority),
    borderColor: getPriorityColor(task.priority),
    extendedProps: {
      description: task.description,
      status: task.status,
      assignedTo: task.assigned_to
    }
  }));

  const handleDateSelect = useCallback((selectInfo: DateSelectArg) => {
    onTaskCreate?.(selectInfo.start);
  }, [onTaskCreate]);

  const handleEventDrop = useCallback((dropInfo: EventDropArg) => {
    const taskId = parseInt(dropInfo.event.id);
    onTaskUpdate?.(taskId, dropInfo.event.start!);
  }, [onTaskUpdate]);

  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const taskId = parseInt(clickInfo.event.id);
    onTaskSelect?.(taskId);
  }, [onTaskSelect]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={events}
        select={handleDateSelect}
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
        height="auto"
        // Styling
        eventClassNames="rounded-md shadow-sm"
        // Make calendar responsive
        contentHeight="auto"
        aspectRatio={1.8}
      />
    </div>
  );
}

function getPriorityColor(priority: Task['priority']): string {
  switch (priority) {
    case 'high':
      return '#EF4444'; // red-500
    case 'medium':
      return '#F59E0B'; // yellow-500
    case 'low':
      return '#10B981'; // green-500
    default:
      return '#6B7280'; // gray-500
  }
}