import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, isBanned } = await request.json();
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isBanned },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user ban status:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
