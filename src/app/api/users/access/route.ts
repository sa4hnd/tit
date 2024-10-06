import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, hasAccess } = await request.json();
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { hasAccess },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user access:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
