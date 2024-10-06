'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface UserStats {
  quizzesTaken: number;
  averageScore: number;
  streakDays: number;
  recentQuizzes: any[];
  leaderboard: any[];
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    quizzesTaken: 0,
    averageScore: 0,
    streakDays: 0,
    recentQuizzes: [],
    leaderboard: [],
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/user-stats?userId=${user.id}`);
          const data = await response.json();
          setStats(data);
        } catch (error) {
          console.error('Error fetching user stats:', error);
          toast.error('Failed to load user statistics');
        }
      }
    };

    fetchUserStats();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-6">
      <div className="max-w-2xl mx-auto bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-8">
        <div className="flex items-center mb-6">
          <Image
            src={user?.photoURL || '/default-avatar.png'}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full mr-4"
          />
          <div>
            <h1 className="text-white text-3xl font-bold">{user?.displayName}</h1>
            <p className="text-white text-lg">{user?.email}</p>
            {user?.hasAccess && (
              <div className="flex items-center mt-2">
                <CheckCircle className="text-green-400 mr-2" />
                <span className="text-green-400">Verified</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-purple-600 bg-opacity-50 rounded-2xl p-4 text-center">
            <h3 className="text-white text-lg font-bold mb-2">Quizzes Taken</h3>
            <p className="text-white text-3xl font-bold">{stats.quizzesTaken}</p>
          </div>
          <div className="bg-blue-600 bg-opacity-50 rounded-2xl p-4 text-center">
            <h3 className="text-white text-lg font-bold mb-2">Avg. Score</h3>
            <p className="text-white text-3xl font-bold">{stats.averageScore}%</p>
          </div>
          <div className="bg-green-600 bg-opacity-50 rounded-2xl p-4 text-center">
            <h3 className="text-white text-lg font-bold mb-2">Streak Days</h3>
            <p className="text-white text-3xl font-bold">{stats.streakDays}</p>
          </div>
        </div>

        <h2 className="text-white text-2xl font-bold mb-4">Recent Quizzes</h2>
        <ul className="space-y-4 mb-8">
          {stats.recentQuizzes.map((quiz, index) => (
            <li key={index} className="bg-white bg-opacity-20 rounded-xl p-4">
              <p className="text-white font-bold">Score: {quiz.score}%</p>
              <p className="text-white text-sm">{new Date(quiz.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>

        <h2 className="text-white text-2xl font-bold mb-4">Leaderboard</h2>
        <ul className="space-y-4">
          {stats.leaderboard.map((entry, index) => (
            <li key={index} className="bg-white bg-opacity-20 rounded-xl p-4 flex justify-between items-center">
              <span className="text-white font-bold">{index + 1}. {entry.displayName}</span>
              <span className="text-white">{entry.totalScore} points</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}