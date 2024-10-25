import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { logger } from '@/lib/logger/logger';

export async function POST() {
  try {
    cookies().delete('session');
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(error as Error, { context: 'POST /api/auth/logout' });
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}