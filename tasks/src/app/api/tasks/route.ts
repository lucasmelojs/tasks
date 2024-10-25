// src/app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { logger } from '@/lib/logger/logger';

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM tasks 
      ORDER BY created_at DESC
    `;
    
    logger.info('Tasks fetched successfully', { count: result.rows.length });
    
    return NextResponse.json({ 
      data: result.rows 
    });
  } catch (error) {
    logger.error(error as Error, { context: 'GET /api/tasks' });
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO tasks (
        title,
        description,
        status,
        priority,
        due_date,
        assigned_to,
        assigned_by
      ) VALUES (
        ${body.title},
        ${body.description || ''},
        ${body.status || 'pending'},
        ${body.priority || 'medium'},
        ${body.due_date ? body.due_date.toString() : null},
        ${body.assigned_to || null},
        ${body.assigned_by || null}
      )
      RETURNING *
    `;

    logger.info('Task created successfully', { taskId: result.rows[0].id });

    return NextResponse.json({ 
      data: result.rows[0] 
    }, { 
      status: 201 
    });
  } catch (error) {
    logger.error(error as Error, { 
      context: 'POST /api/tasks',
      body: await request.clone().text()
    });
    
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}