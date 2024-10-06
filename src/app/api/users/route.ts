import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        displayName: true,
        photoURL: true,
        createdAt: true,
        isBanned: true,
        hasAccess: true,
        streakDays: true,
        quizzesTaken: true,
        totalScore: true,
      },
    });
    const totalUsers = await prisma.user.count();
    return NextResponse.json({ users, totalUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, isAdmin, isBanned } = await request.json();
    const user = await prisma.user.update({
      where: { id },
      data: { isAdmin, isBanned },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
