import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const lastStreakUpdate = new Date(user.lastStreakUpdate);
    const now = new Date();
    const canUpdateStreak = now.getTime() - lastStreakUpdate.getTime() >= 24 * 60 * 60 * 1000;

    return NextResponse.json({
      streakDays: user.streakDays,
      canUpdateStreak,
    });
  } catch (error) {
    console.error('Error checking user streak:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const lastStreakUpdate = new Date(user.lastStreakUpdate);
    const now = new Date();
    const timeDiff = now.getTime() - lastStreakUpdate.getTime();

    if (timeDiff < 24 * 60 * 60 * 1000) {
      return NextResponse.json({ error: 'Streak can only be updated once per day' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        streakDays: { increment: 1 },
        lastStreakUpdate: now,
      },
    });

    return NextResponse.json({
      streakDays: updatedUser.streakDays,
    });
  } catch (error) {
    console.error('Error updating user streak:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}