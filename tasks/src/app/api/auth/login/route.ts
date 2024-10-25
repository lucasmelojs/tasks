// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSessionCookie } from '@/lib/auth';
import { logger } from '@/lib/logger/logger';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    const sessionCookie = await createSessionCookie(idToken);
    
    cookies().set(sessionCookie);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(error as Error, { context: 'POST /api/auth/login' });
    
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}