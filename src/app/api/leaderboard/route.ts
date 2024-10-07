import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
        averageScore: true,
      },
      orderBy: {
        averageScore: 'desc',
      },
      take: 10, // Limit to top 10 users
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
