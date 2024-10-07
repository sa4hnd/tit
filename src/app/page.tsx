'use client';

import {
  GamepadIcon,
  Sparkles,
  Users,
  Instagram,
  MessageCircle,
} from 'lucide-react';
import { UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useAuth } from '@/contexts/AuthContext';

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

interface LeaderboardEntry {
  id: string;
  displayName: string;
  averageScore: number;
}

interface RecentQuiz {
  score: number;
  createdAt: string;
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
  const [recentQuizzes, setRecentQuizzes] = useState<RecentQuiz[]>([]);
  const [userStats, setUserStats] = useState({
    quizzesTaken: 0,
    averageScore: 0,
    streakDays: 0,
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [streakDay, setStreakDay] = useState(0);
  const [canUpdateStreak, setCanUpdateStreak] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);

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
      checkStreak();
    }
  }, [user, hasAccess]);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/user-stats?userId=${user.id}`);
          const data = await response.json();
          setUserStats({
            quizzesTaken: data.quizzesTaken,
            averageScore: data.averageScore,
            streakDays: data.streakDays,
          });
          setRecentQuizzes(data.recentQuizzes || []);
        } catch (error) {
          console.error('Error fetching user stats:', error);
          toast.error('Failed to load user statistics');
        }
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        const data = await response.json();
        setLeaderboard(data);
        if (user) {
          const userRank = data.findIndex((entry) => entry.id === user.id) + 1;
          setUserRank(userRank > 0 ? userRank : null);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        toast.error('Failed to load leaderboard');
      }
    };

    fetchUserStats();
    fetchLeaderboard();
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchRecentQuizzes();
    }
  }, [user]);

  const checkStreak = async () => {
    if (user) {
      try {
        const response = await fetch(`/api/user-streak?userId=${user.id}`);
        const data = await response.json();
        setStreakDay(data.streakDays);
        if (data.canUpdateStreak) {
          setShowWelcomePopup(true);
        }
      } catch (error) {
        console.error('Error checking streak:', error);
      }
    }
  };

  const fetchRecentQuizzes = async () => {
    if (!user) {
      console.error('User is not logged in');
      return;
    }

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
    if (user) {
      try {
        const response = await fetch('/api/user-streak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
        const data = await response.json();
        setStreakDay(data.streakDays);
        setShowWelcomePopup(false);
        toast.success(data.message);
      } catch (error) {
        console.error('Error updating streak:', error);
        toast.error('Failed to update streak');
      }
    }
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-4 sm:p-6'>
      <main className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-white text-4xl font-bold'>Fergeh</h1>
          {user && (
            <button
              onClick={handleProfileClick}
              className='bg-white bg-opacity-20 rounded-full p-1 hover:bg-opacity-30 transition-all'
            >
              <Image
                src={user.photoURL || '/default-avatar.png'}
                alt='Profile'
                width={40}
                height={40}
                className='rounded-full'
              />
            </button>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          <div className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6'>
            <h2 className='text-white text-2xl font-bold mb-4'>
              Your Progress
            </h2>
            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-4'>
                <h3 className='text-white text-lg font-bold mb-2'>
                  Quizzes Taken
                </h3>
                <p className='text-white text-3xl font-bold'>
                  {userStats.quizzesTaken}
                </p>
              </div>
              <div className='bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4'>
                <h3 className='text-white text-lg font-bold mb-2'>
                  Avg. Score
                </h3>
                <p className='text-white text-3xl font-bold'>
                  {userStats.averageScore}%
                </p>
              </div>
              <div className='bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-4'>
                <h3 className='text-white text-lg font-bold mb-2'>
                  Streak Days
                </h3>
                <p className='text-white text-3xl font-bold'>{streakDay}</p>
              </div>
              <div className='bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-4'>
                <h3 className='text-white text-lg font-bold mb-2'>Your Rank</h3>
                <p className='text-white text-3xl font-bold'>
                  {userRank !== null ? `#${userRank}` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {leaderboard.length > 0 && (
            <div className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6 mb-6'>
              <h2 className='text-white text-2xl font-bold mb-4'>
                Leaderboard
              </h2>
              <ul className='space-y-2'>
                {leaderboard.map((entry, index) => (
                  <li
                    key={entry.id}
                    className='flex justify-between items-center text-white p-2 rounded-xl border border-white border-opacity-20'
                  >
                    <span>
                      {index + 1}. {entry.displayName}
                    </span>
                    <span>{entry.averageScore.toFixed(2)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Quiz Categories */}
        <section className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6 mt-6'>
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
        <section className='mb-8'>
          <h2 className='text-white text-2xl font-bold mb-4'>Game Modes</h2>
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

        {user && hasAccess && (
          <div className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6 mt-6'>
            <h2 className='text-white text-2xl font-bold mb-4'>
              Recent Quiz Results
            </h2>
            {recentQuizzes.length > 0 ? (
              <ul>
                {recentQuizzes.map((quiz, index) => (
                  <li key={index} className='text-white mb-2'>
                    Score: {quiz.score} - Date:{' '}
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-white'>No recent quizzes taken.</p>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className='mt-12 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='mb-4 md:mb-0'>
              <p className='text-white text-sm'>
                © 2024 All rights reserved to Sahind Hamzani
              </p>
              <Link
                href='/privacy-policy'
                className='text-white text-sm hover:underline'
              >
                Privacy Policy
              </Link>
            </div>
            <div className='flex space-x-4'>
              <a
                href='https://instagram.com/your_instagram'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Instagram className='text-white w-6 h-6 hover:text-pink-400' />
              </a>
              <a
                href='https://wa.me/your_whatsapp_number'
                target='_blank'
                rel='noopener noreferrer'
              >
                <MessageCircle className='text-white w-6 h-6 hover:text-green-400' />
              </a>
              <a
                href='https://t.me/your_telegram'
                target='_blank'
                rel='noopener noreferrer'
              >
                <svg
                  className='text-white w-6 h-6 hover:text-blue-400'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                >
                  <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.766-.546 2.614-.977 4.764-.431 2.15-.977 4.768-1.187 5.624-.21.856-.39 1.54-.39 1.719 0 .179-.104.269-.104.269s-.287.179-.574.269c-.287.09-.688.09-.977-.09-.289-.179-1.411-1.001-1.411-1.001s-1.695-1.18-2.556-1.988c-.079-.09-.157-.18-.21-.269-.052-.09-.079-.18-.052-.269.026-.09.183-.278.183-.278s.339-.36.977-1.091c.639-.73 1.258-1.54 1.563-1.988.304-.45.304-.63.304-.72 0-.09-.026-.179-.104-.269-.079-.09-.21-.09-.21-.09l-.026-.026s-3.22-1.18-3.272-1.27c-.052-.09-.157-.36-.157-.539 0-.18.079-.36.21-.45.13-.09.821-.36 2.478-.989 1.657-.63 2.945-1.001 3.246-1.091.3-.09.534-.135.742-.135.209 0 .469.045.651.225.183.18.236.45.262.63.026.18.052 1.151.052 1.151z' />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </main>

      {showWelcomePopup && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6 max-w-md w-full'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-white text-2xl font-bold'>Welcome Back!</h2>
              <button
                onClick={() => setShowWelcomePopup(false)}
                className='text-white'
              >
                <X size={24} />
              </button>
            </div>
            <p className='text-white text-lg mb-4'>
              You're on day {streakDay + 1} of your streak!
            </p>
            <Button onClick={handleUpdateStreak} className='w-full'>
              Continue Streak
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
