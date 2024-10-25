'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';
import { LogoutButton } from '@/components/auth/LogoutButton';

export function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-gray-800">
                Task Manager
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
              <div className="flex items-center">
            <LogoutButton />
             </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}