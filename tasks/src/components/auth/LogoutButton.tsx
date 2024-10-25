// src/components/auth/LogoutButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { logger } from '@/lib/logger/logger';

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Sign out from Firebase
      await auth.signOut();

      // Clear session cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      // Redirect to login
      router.push('/auth/login');
    } catch (error) {
      logger.error(error as Error, { context: 'LogoutButton' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-sm font-medium text-gray-700 hover:text-gray-800 disabled:opacity-50"
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}