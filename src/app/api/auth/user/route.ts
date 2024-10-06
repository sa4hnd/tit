import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { firebaseUid, email, displayName, photoURL } = await request.json();
    const user = await prisma.user.upsert({
      where: { firebaseUid },
      update: { email, displayName, photoURL },
      create: {
        firebaseUid,
        email,
        displayName,
        photoURL,
        hasAccess: false,
        streakDays: 0,
        quizzesTaken: 0,
        totalScore: 0,
        averageScore: 0,
        lastStreakUpdate: new Date(),
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const firebaseUid = searchParams.get('firebaseUid');
  const email = searchParams.get('email');

  if (!firebaseUid && !email) {
    return NextResponse.json(
      { error: 'Firebase UID or email is required' },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: firebaseUid ? { firebaseUid } : { email: email as string },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
