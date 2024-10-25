import { sql } from '@vercel/postgres';
import { logger } from '@/lib/logger/logger';
import { DatabaseError, NotFoundError } from '@/lib/errors';
import type { Task, User, TaskComment, Notification } from '@/types/db';

export const db = {
  tasks: {
    // Add getAll method
    async getAll(): Promise<Task[]> {
      try {
        logger.debug('Executing getAll tasks query');
        
        const result = await sql`
          SELECT * FROM tasks 
          ORDER BY created_at DESC;
        `;
        
        logger.debug('Tasks retrieved from database:', { 
          count: result.rows.length 
        });

        return result.rows as Task[];
      } catch (error) {
        logger.error(error as Error, { operation: 'getAllTasks' });
        throw new DatabaseError('Failed to fetch tasks', error);
      }
    },

    // Rest of your existing methods
    async create(data: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
      try {
        const result = await sql`
          INSERT INTO tasks (
            title, description, status, priority, due_date, assigned_to, assigned_by
          ) VALUES (
            ${data.title}, ${data.description}, ${data.status}, ${data.priority},
            ${data.due_date.toISOString()}, ${data.assigned_to}, ${data.assigned_by}
          )
          RETURNING *;
        `;

        if (!result.rows[0]) {
          throw new DatabaseError('Failed to create task: No rows returned');
        }

        return result.rows[0] as Task;
      } catch (error) {
        logger.error(error as Error, { operation: 'createTask', data });
        throw new DatabaseError('Failed to create task', error);
      }
    },

    async getById(id: number): Promise<Task> {
      try {
        const result = await sql`
          SELECT * FROM tasks WHERE id = ${id};
        `;

        if (!result.rows[0]) {
          throw new NotFoundError('Task not found');
        }

        return result.rows[0] as Task;
      } catch (error) {
        if (error instanceof NotFoundError) throw error;
        
        logger.error(error as Error, { operation: 'getTaskById', taskId: id });
        throw new DatabaseError('Failed to fetch task', error);
      }
    },

    async update(id: number, data: Partial<Task>): Promise<Task> {
      try {
        const result = await sql`
          UPDATE tasks
          SET
            title = COALESCE(${data.title}, title),
            description = COALESCE(${data.description}, description),
            status = COALESCE(${data.status}, status),
            priority = COALESCE(${data.priority}, priority),
            due_date = COALESCE(${data.due_date ? data.due_date.toISOString() : undefined}, due_date),
            assigned_to = COALESCE(${data.assigned_to}, assigned_to),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id}
          RETURNING *;
        `;

        if (!result.rows[0]) {
          throw new NotFoundError('Task not found');
        }

        return result.rows[0] as Task;
      } catch (error) {
        if (error instanceof NotFoundError) throw error;
        
        logger.error(error as Error, { operation: 'updateTask', taskId: id, data });
        throw new DatabaseError('Failed to update task', error);
      }
    },

    async delete(id: number): Promise<void> {
      try {
        const result = await sql`
          DELETE FROM tasks WHERE id = ${id};
        `;

        if (result.rowCount === 0) {
          throw new NotFoundError('Task not found');
        }
      } catch (error) {
        if (error instanceof NotFoundError) throw error;
        
        logger.error(error as Error, { operation: 'deleteTask', taskId: id });
        throw new DatabaseError('Failed to delete task', error);
      }
    },

    async getByAssignee(userId: string): Promise<Task[]> {
      try {
        const result = await sql`
          SELECT * FROM tasks 
          WHERE assigned_to = ${userId} 
          ORDER BY created_at DESC;
        `;
        
        return result.rows as Task[];
      } catch (error) {
        logger.error(error as Error, { operation: 'getTasksByAssignee', userId });
        throw new DatabaseError('Failed to fetch tasks', error);
      }
    }
  },

  users: {
    // Your existing users methods remain the same
    async create(data: Omit<User, 'created_at' | 'updated_at'>): Promise<User> {
      try {
        const result = await sql`
          INSERT INTO users (id, email, name, role)
          VALUES (${data.id}, ${data.email}, ${data.name}, ${data.role})
          RETURNING *;
        `;

        if (!result.rows[0]) {
          throw new DatabaseError('Failed to create user: No user returned');
        }

        return result.rows[0] as User;
      } catch (error) {
        logger.error(error as Error, { operation: 'createUser', data });
        throw new DatabaseError('Failed to create user', error);
      }
    },

    async getById(id: string): Promise<User> {
      try {
        const result = await sql`
          SELECT * FROM users WHERE id = ${id};
        `;

        if (!result.rows[0]) {
          throw new NotFoundError('User not found');
        }

        return result.rows[0] as User;
      } catch (error) {
        if (error instanceof NotFoundError) throw error;
        
        logger.error(error as Error, { operation: 'getUserById', userId: id });
        throw new DatabaseError('Failed to fetch user', error);
      }
    }
  }
};