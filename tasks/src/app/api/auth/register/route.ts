// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { createSessionCookie } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { logger } from '@/lib/logger/logger';

export async function POST(request: Request) {
  try {
    const { idToken, name, email, role } = await request.json();

    // Create user in database
    await db.users.create({
      id: idToken.uid,
      name,
      email,
      role,
    });

    // Create session cookie
    const sessionCookie = await createSessionCookie(idToken);
    
    // Set cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set(sessionCookie);

    return response;
  } catch (error) {
    logger.error(error as Error, { context: 'POST /api/auth/register' });
    
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}