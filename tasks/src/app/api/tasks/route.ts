import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';
import { db } from '@/lib/db';
import { logger } from '@/lib/logger';
import { ValidationError } from '@/lib/errors';
import type { Task } from '@/types/db';

export async function GET(request: Request) {
  try {
    const user = await authenticate();
    const tasks = await db.tasks.getByAssignee(user.id);
    
    return NextResponse.json(tasks);
  } catch (error) {
    logger.error(error as Error, { path: '/api/tasks', method: 'GET' });
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch tasks' },
      { status: error instanceof Error ? (error as any).statusCode || 500 : 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await authenticate();
    const data = await request.json();

    // Validate request data
    if (!data.title?.trim()) {
      throw new ValidationError('Title is required');
    }

    const task = await db.tasks.create({
      ...data,
      assigned_by: user.id,
      status: 'pending',
      priority: data.priority || 'medium',
    });

    logger.info('Task created', { taskId: task.id, userId: user.id });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    logger.error(error as Error, { path: '/api/tasks', method: 'POST' });
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create task' },
      { status: error instanceof Error ? (error as any).statusCode || 500 : 500 }
    );
  }
}
