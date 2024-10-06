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
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { UserIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

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
  const { user, signOut, hasAccess } = useAuth();
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [userStats, setUserStats] = useState({
    quizzesTaken: 0,
    averageScore: 0,
    streakDays: 0
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [streakDay, setStreakDay] = useState(0);
  const [canUpdateStreak, setCanUpdateStreak] = useState(false);

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

  useEffect(() => {
    if (user && hasAccess) {
      fetchRecentQuizzes();
    }
  }, [user, hasAccess]);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/user-stats?userId=${user.id}`);
          const data = await response.json();
          setUserStats(data);
        } catch (error) {
          console.error('Error fetching user stats:', error);
          toast.error('Failed to load user statistics');
        }
      }
    };

    fetchUserStats();
  }, [user]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const checkStreak = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/user-streak?userId=${user.id}`);
          const data = await response.json();
          setStreakDay(data.streakDays);
          setCanUpdateStreak(data.canUpdateStreak);
        } catch (error) {
          console.error('Error checking streak:', error);
        }
      }
    };

    checkStreak();
  }, [user]);

  const fetchRecentQuizzes = async () => {
    try {
      const response = await fetch(`/api/user-stats?userId=${user.id}`);
      const data = await response.json();
      setRecentQuizzes(data.recentQuizzes);
    } catch (error) {
      console.error('Error fetching recent quizzes:', error);
    }
  };

  const handleStartQuiz = () => {
    if (selectedSubject && selectedYear && selectedCourse) {
      router.push(
        `/quiz?subjectId=${selectedSubject}&yearId=${selectedYear}&courseId=${selectedCourse}`
      );
    }
  };

  const handleUpdateStreak = async () => {
    if (user && canUpdateStreak) {
      try {
        const response = await fetch('/api/user-streak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
        const data = await response.json();
        setStreakDay(data.streakDays);
        setCanUpdateStreak(false);
        toast.success('Streak updated!');
      } catch (error) {
        console.error('Error updating streak:', error);
        toast.error('Failed to update streak');
      }
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-6'>
      <header className='flex justify-between items-center mb-8'>
        <h1 className='text-white text-4xl font-bold'>Welcome to Fergeh</h1>
        {user ? (
          <Link href="/profile">
            <UserIcon className='text-white w-8 h-8 cursor-pointer' />
          </Link>
        ) : (
          <Link href="/login">
            <Button className='bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 px-4 rounded-2xl transition-transform transform hover:scale-105'>
              Sign In
            </Button>
          </Link>
        )}
      </header>

      <main className='space-y-8'>
        {/* User Stats */}
        <section className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6'>
          <h2 className='text-white text-xl font-bold mb-4'>Your Progress</h2>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-purple-600 bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-2xl p-4 text-center">
              <h3 className="text-white text-lg font-bold mb-2">Quizzes Taken</h3>
              <p className="text-white text-3xl font-bold">{userStats.quizzesTaken}</p>
            </div>
            <div className="bg-blue-600 bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-2xl p-4 text-center">
              <h3 className="text-white text-lg font-bold mb-2">Avg. Score</h3>
              <p className="text-white text-3xl font-bold">{userStats.averageScore}%</p>
            </div>
            <div className="bg-green-600 bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-2xl p-4 text-center">
              <h3 className="text-white text-lg font-bold mb-2">Streak Days</h3>
              <p className="text-white text-3xl font-bold">{userStats.streakDays}</p>
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

        {user && hasAccess && (
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6 mt-6">
            <h2 className="text-white text-2xl font-bold mb-4">Recent Quiz Results</h2>
            {recentQuizzes.length > 0 ? (
              <ul>
                {recentQuizzes.map((quiz, index) => (
                  <li key={index} className="text-white mb-2">
                    Score: {quiz.score} - Date: {new Date(quiz.createdAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white">No recent quizzes taken.</p>
            )}
          </div>
        )}

        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-8 mb-8">
          <h2 className="text-white text-2xl font-bold mb-4">Leaderboard</h2>
          <ul className="space-y-4">
            {leaderboard.map((entry, index) => (
              <li key={index} className="bg-white bg-opacity-20 rounded-xl p-4 flex justify-between items-center">
                <span className="text-white font-bold">{index + 1}. {entry.displayName}</span>
                <span className="text-white">{entry.totalScore} points</span>
              </li>
            ))}
          </ul>
        </div>

        {user && canUpdateStreak && (
          <Button onClick={handleUpdateStreak} className="mb-4">
            Update Streak: Day {streakDay + 1}
          </Button>
        )}
      </main>
    </div>
  );
}