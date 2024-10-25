// src/app/api/admin/init-db/route.ts
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger/logger';

export async function GET() {
  try {
    // Create table
    await sql.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        description TEXT,
        status VARCHAR NOT NULL DEFAULT 'pending',
        priority VARCHAR NOT NULL DEFAULT 'medium',
        due_date TIMESTAMPTZ,
        assigned_to VARCHAR,
        assigned_by VARCHAR,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes (separate queries)
    await sql.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to)
    `);

    await sql.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)
    `);

    await sql.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date)
    `);

    return NextResponse.json({ 
      success: true, 
      message: 'Tasks table created successfully'
    });
  } catch (error) {
    console.error('Error creating tasks table:', error);
    return NextResponse.json({ 
      error: 'Failed to create tasks table',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}