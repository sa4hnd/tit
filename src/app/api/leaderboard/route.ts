import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
        quizzesTaken: true,
        totalScore: true,
      },
      orderBy: {
        totalScore: 'desc',
      },
      take: 10,
    });

    const leaderboardWithAvgScore = leaderboard.map((user) => ({
      ...user,
      averageScore:
        user.quizzesTaken > 0
          ? Math.round((user.totalScore / user.quizzesTaken) * 100) / 100
          : 0,
    }));

    leaderboardWithAvgScore.sort((a, b) => b.averageScore - a.averageScore);

    return NextResponse.json(leaderboardWithAvgScore);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
