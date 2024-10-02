'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  User,
  GamepadIcon,
  Users,
  Sparkles,
  TrendingUp,
  ChevronDown,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Subject {
  id: number;
  name: string;
}

interface Year {
  id: number;
  name: string;
}

interface Course {
  id: number;
  name: string;
}

export default function HomePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [subjectsRes, yearsRes, coursesRes] = await Promise.all([
          fetch('/api/subjects'),
          fetch('/api/years'),
          fetch('/api/courses'),
        ]);
        const [subjectsData, yearsData, coursesData] = await Promise.all([
          subjectsRes.json(),
          yearsRes.json(),
          coursesRes.json(),
        ]);
        setSubjects(subjectsData);
        setYears(yearsData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  const handleStartQuiz = () => {
    if (selectedSubject && selectedYear && selectedCourse) {
      router.push(
        `/quiz?subjectId=${selectedSubject}&yearId=${selectedYear}&courseId=${selectedCourse}`
      );
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-6'>
      <h1 className='text-white text-4xl font-bold mb-8 text-center'>
        Welcome to Fergeh
      </h1>
      <main className='space-y-8'>
        {/* User Stats */}
        <section className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6'>
          <h2 className='text-white text-xl font-bold mb-4'>Your Progress</h2>
          <div className='grid grid-cols-3 gap-4'>
            <div className='bg-pink-500 bg-opacity-20 rounded-2xl p-4 text-center'>
              <p className='text-white text-2xl font-bold'>42</p>
              <p className='text-white text-sm'>Quizzes Taken</p>
            </div>
            <div className='bg-blue-500 bg-opacity-20 rounded-2xl p-4 text-center'>
              <p className='text-white text-2xl font-bold'>78%</p>
              <p className='text-white text-sm'>Avg. Score</p>
            </div>
            <div className='bg-green-500 bg-opacity-20 rounded-2xl p-4 text-center'>
              <p className='text-white text-2xl font-bold'>15</p>
              <p className='text-white text-sm'>Streak Days</p>
            </div>
          </div>
        </section>

        {/* Quiz Categories */}
        <section className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6'>
          <h2 className='text-white text-xl font-bold mb-4'>Quiz Categories</h2>
          <div className='space-y-4'>
            {/* Subject Dropdown */}
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className='w-full bg-white bg-opacity-20 text-white rounded-2xl py-3 px-4'>
                <SelectValue placeholder='Select Subject' />
              </SelectTrigger>
              <SelectContent className='bg-purple-800 text-white border-none rounded-xl'>
                {subjects.map((subject) => (
                  <SelectItem
                    key={subject.id}
                    value={subject.id.toString()}
                    className='focus:bg-purple-700 focus:text-white'
                  >
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year Dropdown */}
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className='w-full bg-white bg-opacity-20 text-white rounded-2xl py-3 px-4'>
                <SelectValue placeholder='Select Year' />
              </SelectTrigger>
              <SelectContent className='bg-purple-800 text-white border-none rounded-xl'>
                {years.map((year) => (
                  <SelectItem
                    key={year.id}
                    value={year.id.toString()}
                    className='focus:bg-purple-700 focus:text-white'
                  >
                    {year.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Course Dropdown */}
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className='w-full bg-white bg-opacity-20 text-white rounded-2xl py-3 px-4'>
                <SelectValue placeholder='Select Course' />
              </SelectTrigger>
              <SelectContent className='bg-purple-800 text-white border-none rounded-xl'>
                {courses.map((course) => (
                  <SelectItem
                    key={course.id}
                    value={course.id.toString()}
                    className='focus:bg-purple-700 focus:text-white'
                  >
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              onClick={handleStartQuiz}
              className='w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-2xl transition-transform transform hover:scale-105'
            >
              Start Quiz
            </button>
          </div>
        </section>

        {/* Game Modes */}
        <section>
          <h2 className='text-white text-xl font-bold mb-4'>Game Modes</h2>
          <div className='grid grid-cols-2 gap-4'>
            {[
              {
                name: 'Challenge',
                icon: GamepadIcon,
                desc: 'Play single',
                color: 'from-blue-400 to-blue-600',
              },
              {
                name: 'Tournament',
                icon: Users,
                desc: 'Play with strangers',
                color: 'from-pink-400 to-pink-600',
              },
              {
                name: 'Duel',
                icon: GamepadIcon,
                desc: 'Play with friend',
                color: 'from-green-400 to-green-600',
              },
              {
                name: 'Lucky',
                icon: Sparkles,
                desc: 'Play single and learn',
                color: 'from-purple-400 to-purple-600',
              },
            ].map((mode) => (
              <button
                key={mode.name}
                className={`bg-gradient-to-br ${mode.color} bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center justify-center transition-transform transform hover:scale-105`}
              >
                <mode.icon className='text-white w-8 h-8 mb-2' />
                <h3 className='text-white font-semibold'>{mode.name}</h3>
                <p className='text-white text-xs'>{mode.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Leaderboard Preview */}
        <section className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6'>
          <h2 className='text-white text-xl font-bold mb-4'>Leaderboard</h2>
          <div className='space-y-4'>
            {[
              { name: 'Alex', score: 2500, rank: 1 },
              { name: 'Sam', score: 2350, rank: 2 },
              { name: 'Jordan', score: 2200, rank: 3 },
            ].map((player) => (
              <div
                key={player.name}
                className='flex items-center justify-between bg-white bg-opacity-20 rounded-xl p-3'
              >
                <div className='flex items-center'>
                  <div className='bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center mr-3'>
                    <span className='text-white font-bold'>{player.rank}</span>
                  </div>
                  <span className='text-white font-semibold'>
                    {player.name}
                  </span>
                </div>
                <div className='flex items-center'>
                  <TrendingUp className='text-green-400 w-4 h-4 mr-2' />
                  <span className='text-white font-bold'>{player.score}</span>
                </div>
              </div>
            ))}
          </div>
          <button className='w-full mt-4 bg-white bg-opacity-20 text-white font-semibold py-2 rounded-xl transition-colors hover:bg-opacity-30'>
            View Full Leaderboard
          </button>
        </section>
      </main>
    </div>
  );
}
