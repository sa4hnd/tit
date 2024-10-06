import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, score, total, percentage, subjectId, yearId, courseId } =
      await request.json();

    console.log('Received quiz result:', {
      userId,
      score,
      total,
      percentage,
      subjectId,
      yearId,
      courseId,
    });

    // Store the quiz result
    const quizResult = await prisma.quizResult.create({
      data: {
        userId,
        score,
        total,
        percentage,
        subjectId: parseInt(subjectId),
        yearId: parseInt(yearId),
        courseId: parseInt(courseId),
      },
    });

    // Update user's stats
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { quizzesTaken: true, totalScore: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newTotalScore = user.totalScore + percentage; // Use percentage instead of score
    const newQuizzesTaken = user.quizzesTaken + 1;
    const newAvgScore =
      newQuizzesTaken > 0 ? newTotalScore / newQuizzesTaken : 0;

    console.log('User before update:', user);
    console.log('New quiz stats:', {
      newTotalScore,
      newQuizzesTaken,
      newAvgScore,
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        quizzesTaken: newQuizzesTaken,
        totalScore: newTotalScore,
        averageScore: Math.round(newAvgScore * 100) / 100, // Round to 2 decimal places
      },
    });

    console.log('Updated user:', updatedUser);

    return NextResponse.json({
      message: 'Quiz result submitted successfully',
      avgScore: Math.round(newAvgScore * 100) / 100, // Round to 2 decimal places
    });
  } catch (error) {
    console.error('Error submitting quiz result:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
