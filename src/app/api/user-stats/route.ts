import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        quizzesTaken: true,
        totalScore: true,
        streakDays: true,
        averageScore: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const recentQuizzes = await prisma.quizResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        subject: true,
        year: true,
        course: true,
      },
    });

    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
        averageScore: true,
      },
      orderBy: {
        averageScore: 'desc',
      },
      take: 10,
    });

    return NextResponse.json({
      quizzesTaken: user.quizzesTaken,
      averageScore: user.averageScore,
      streakDays: user.streakDays,
      recentQuizzes,
      leaderboard,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, score } = await request.json();

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        quizzesTaken: { increment: 1 },
        totalScore: { increment: score },
        streakDays: { increment: 1 }, // This is simplified; you might want more complex streak logic
      },
    });

    await prisma.quiz.create({
      data: {
        userId,
        score,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
