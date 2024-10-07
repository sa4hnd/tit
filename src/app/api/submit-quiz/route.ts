import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, score, total, percentage, subjectId, yearId, courseId } =
      await request.json();

    console.log('Received quiz submission:', {
      userId,
      score,
      total,
      percentage,
      subjectId,
      yearId,
      courseId,
    });

    if (
      !userId ||
      score === undefined ||
      total === undefined ||
      percentage === undefined ||
      !subjectId ||
      !yearId ||
      !courseId
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

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

    const newTotalScore = user.totalScore + percentage;
    const newQuizzesTaken = user.quizzesTaken + 1;
    const newAvgScore =
      newQuizzesTaken > 0 ? newTotalScore / newQuizzesTaken : 0;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        quizzesTaken: newQuizzesTaken,
        totalScore: newTotalScore,
        averageScore: Math.round(newAvgScore * 100) / 100, // Round to 2 decimal places
      },
    });

    // Update streak
    const today = new Date().toISOString().split('T')[0];

    // Check if the Streak model exists in the Prisma schema
    if (prisma.streak) {
      const lastStreak = await prisma.streak.findFirst({
        where: { userId },
        orderBy: { date: 'desc' },
      });

      if (!lastStreak || lastStreak.date !== today) {
        await prisma.streak.create({
          data: {
            userId,
            date: today,
          },
        });
      }
    } else {
      console.warn('Streak model not found in Prisma schema');
    }

    console.log('Updated user:', updatedUser);

    return NextResponse.json({
      message: 'Quiz submitted successfully',
      avgScore: Math.round(newAvgScore * 100) / 100,
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
