// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { logger } from '@/lib/logger/logger';

export async function POST() {
  try {
    // Delete the session cookie
    cookies().delete('session');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(error as Error, { context: 'POST /api/auth/logout' });
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}