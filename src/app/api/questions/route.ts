import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get('subjectId');
  const yearId = searchParams.get('yearId');
  const courseId = searchParams.get('courseId');

  try {
    const questions = await prisma.question.findMany({
      where: {
        subjectId: subjectId ? parseInt(subjectId) : undefined,
        yearId: yearId ? parseInt(yearId) : undefined,
        courseId: courseId ? parseInt(courseId) : undefined,
      },
    });
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, options, answer, subjectId, yearId, courseId } = body;

    const question = await prisma.question.create({
      data: {
        text,
        options,
        answer,
        subjectId,
        yearId,
        courseId,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, text, options, answer, subjectId, yearId, courseId } = body;

    const question = await prisma.question.update({
      where: { id },
      data: {
        text,
        options,
        answer,
        subjectId,
        yearId,
        courseId,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
