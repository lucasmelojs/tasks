import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSessionCookie } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { AuthenticationError } from '@/lib/errors';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    
    if (!idToken) {
      throw new AuthenticationError('ID token is required');
    }

    const sessionCookie = await createSessionCookie(idToken);
    cookies().set(sessionCookie);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(error as Error, { path: '/api/auth/login' });
    
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
