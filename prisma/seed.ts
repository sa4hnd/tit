import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started');

  // Seed Subjects
  const subjects = [
    { name: 'Mathematics' },
    { name: 'Physics' },
    { name: 'Chemistry' },
    { name: 'Biology' },
  ];

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { name: subject.name },
      update: {},
      create: subject,
    });
  }

  // Seed Years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => ({
    name: (currentYear - i).toString(),
  }));

  for (const year of years) {
    await prisma.year.upsert({
      where: { name: year.name },
      update: {},
      create: year,
    });
  }

  // Seed Courses
  const courses = [{ name: 'First Course' }, { name: 'Second Course' }];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { name: course.name },
      update: {},
      create: course,
    });
  }

  console.log('Seeding finished');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
