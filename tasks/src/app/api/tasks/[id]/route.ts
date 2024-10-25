// src/app/api/tasks/[id]/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { logger } from '@/lib/logger/logger';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const taskId = parseInt(params.id);

    const result = await sql`
      UPDATE tasks
      SET
        title = COALESCE(${body.title}, title),
        description = COALESCE(${body.description}, description),
        status = COALESCE(${body.status}, status),
        priority = COALESCE(${body.priority}, priority),
        due_date = COALESCE(${body.due_date ? body.due_date : null}, due_date),
        assigned_to = COALESCE(${body.assigned_to}, assigned_to),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${taskId}
      RETURNING *
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    logger.info('Task updated successfully', { taskId });

    return NextResponse.json({ 
      data: result.rows[0] 
    });
  } catch (error) {
    logger.error(error as Error, { 
      context: `PUT /api/tasks/${params.id}`,
      body: await request.clone().text()
    });
    
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);

    const result = await sql`
      DELETE FROM tasks
      WHERE id = ${taskId}
      RETURNING id
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    logger.info('Task deleted successfully', { taskId });

    return NextResponse.json({ 
      success: true 
    });
  } catch (error) {
    logger.error(error as Error, { 
      context: `DELETE /api/tasks/${params.id}`
    });
    
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}