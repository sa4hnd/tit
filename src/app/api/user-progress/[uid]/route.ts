import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { uid: string } }
) {
  try {
    const uid = params.uid;
    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
      include: {
        quizzes: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const quizzesTaken = user.quizzes.length;
    const averageScore =
      user.quizzes.reduce((sum, quiz) => sum + quiz.score, 0) / quizzesTaken ||
      0;
    const streakDays = calculateStreakDays(user.quizzes);
    const leaderboardRank = await calculateLeaderboardRank(user.id);

    return NextResponse.json({
      quizzesTaken,
      averageScore: Math.round(averageScore * 100) / 100,
      streakDays,
      leaderboardRank,
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

function calculateStreakDays(quizzes: any[]): number {
  // Implement streak calculation logic
  // This is a placeholder implementation
  return quizzes.length > 0 ? Math.min(quizzes.length, 7) : 0;
}

async function calculateLeaderboardRank(userId: string): Promise<number> {
  // Implement leaderboard rank calculation logic
  // This is a placeholder implementation
  const usersCount = await prisma.user.count();
  return Math.floor(Math.random() * usersCount) + 1;
}
