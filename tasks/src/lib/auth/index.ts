import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';
import { AuthenticationError } from '@/lib/errors';
import type { User } from '@/types/db';

export async function authenticate(): Promise<User> {
  try {
    const session = cookies().get('session');
    
    if (!session?.value) {
      throw new AuthenticationError();
    }

    const decodedToken = await adminAuth.verifySessionCookie(session.value, true);
    const user = await adminAuth.getUser(decodedToken.uid);

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    return {
      id: user.uid,
      email: user.email || '',
      name: user.displayName || '',
      role: (user.customClaims?.role as User['role']) || 'agent',
      created_at: new Date(user.metadata.creationTime || ''),
      updated_at: new Date(user.metadata.lastSignInTime || ''),
    };
  } catch (error) {
    throw new AuthenticationError('Invalid session');
  }
}

export async function createSessionCookie(idToken: string) {
  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    const options = {
      name: 'session',
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    };

    return options;
  } catch (error) {
    throw new AuthenticationError('Failed to create session');
  }
}

export async function setUserRole(userId: string, role: User['role']) {
  try {
    await adminAuth.setCustomUserClaims(userId, { role });
  } catch (error) {
    throw new AuthenticationError('Failed to set user role');
  }
}
