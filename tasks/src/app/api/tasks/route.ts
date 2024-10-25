import { NextResponse } from 'next/server';
import { db } from '@/lib/db/db';
import { authenticate } from '@/lib/auth';
import { logger } from '@/lib/logger/logger';
import { ValidationError } from '@/lib/errors';

export async function GET() {
  try {
    const user = await authenticate();
    
    const tasks = await db.tasks.getAll();
    
    logger.info('Tasks fetched successfully', {
      userId: user?.id,
      taskCount: tasks.length
    });

    // Make sure we're returning a properly formatted JSON response
    return NextResponse.json({ data: tasks });

  } catch (error) {
    logger.error(error as Error, { context: 'GET /api/tasks' });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch tasks',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await authenticate();
    const data = await request.json();

    // Validate required fields
    if (!data.title?.trim()) {
      throw new ValidationError('Title is required');
    }
    
    if (!data.due_date) {
      throw new ValidationError('Due date is required');
    }

    if (!data.assigned_to) {
      throw new ValidationError('Assignee is required');
    }

    const task = await db.tasks.create({
      title: data.title.trim(),
      description: data.description?.trim() || '',
      status: 'pending',
      priority: data.priority || 'medium',
      due_date: new Date(data.due_date),
      assigned_to: data.assigned_to,
      assigned_by: user?.id ?? 'unknown'
    });

    logger.info('Task created successfully', { 
      taskId: task.id, 
      userId: user?.id 
    });

    return NextResponse.json({ data: task }, { status: 201 });

  } catch (error) {
    logger.error(error as Error, {
      context: 'POST /api/tasks',
      body: await request.clone().text()
    });

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}