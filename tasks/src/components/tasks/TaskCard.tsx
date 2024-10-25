// src/components/tasks/TaskCard.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/AlertDialog';
import { PencilIcon, TrashIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { logger } from '@/lib/logger/logger';
import type { Task } from '@/types/db';

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
  onDelete: () => void;
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedTask),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update task');
      }

      logger.info('Task updated successfully', { taskId: task.id });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      logger.error(error as Error, { 
        context: 'TaskCard.handleUpdate',
        taskId: task.id 
      });
      setError(error instanceof Error ? error.message : 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete task');
      }

      logger.info('Task deleted successfully', { taskId: task.id });
      setIsDeleting(false);
      onDelete();
    } catch (error) {
      logger.error(error as Error, {
        context: 'TaskCard.handleDelete',
        taskId: task.id
      });
      setError(error instanceof Error ? error.message : 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <Card className="w-full p-4">
        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="w-full"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <Select
                value={editedTask.priority}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as "low" | "medium" | "high" })}
                className="w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select
                value={editedTask.status}
                onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as "pending" | "in_progress" | "completed" | "cancelled" })}
                className="w-full"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              onClick={() => setIsEditing(false)}
              disabled={loading}
              variant="outline"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={loading}
              variant="primary"
            >
              <CheckIcon className="h-4 w-4 mr-1" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full p-4">
        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {task.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {task.description}
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              variant="ghost"
              size="sm"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setIsDeleting(true)}
              disabled={loading}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className={`px-2 py-1 rounded-full text-xs ${
            task.priority === 'high' 
              ? 'bg-red-100 text-red-800'
              : task.priority === 'medium'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {task.priority}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            task.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : task.status === 'in_progress'
              ? 'bg-blue-100 text-blue-800'
              : task.status === 'cancelled'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {task.status}
          </span>
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
            Due: {new Date(task.due_date).toLocaleDateString()}
          </span>
        </div>
      </Card>

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}