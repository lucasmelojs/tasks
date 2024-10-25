// src/lib/auth/index.ts
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';
import { AuthenticationError } from '@/lib/errors';
import type { User } from '@/types/db';
import { logger } from '../logger/logger';

export async function authenticate(): Promise<User | null> {
  try {
    const session = cookies().get('session');
    
    if (!session?.value) {
      return null;
    }

    try {
      const decodedToken = await adminAuth.verifySessionCookie(session.value, true);
      const user = await adminAuth.getUser(decodedToken.uid);

      if (!user) {
        return null;
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
      logger.error(error as Error, { context: 'authenticate', sessionExists: true });
      return null;
    }
  } catch (error) {
    logger.error(error as Error, { context: 'authenticate', unexpected: true });
    return null;
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
    logger.error(error as Error, { context: 'createSessionCookie' });
    throw new AuthenticationError('Failed to create session');
  }
}

