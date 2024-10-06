import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const years = await prisma.year.findMany();
    return NextResponse.json(years);
  } catch (error) {
    console.error('Error fetching years:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const year = await prisma.year.create({
      data: { name },
    });
    return NextResponse.json(year);
  } catch (error) {
    console.error('Error creating year:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
