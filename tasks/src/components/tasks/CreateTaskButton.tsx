'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { CreateTaskDialog } from './CreateDialog';

export function CreateTaskButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Create Task
      </button>

      <CreateTaskDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}