'use client';

import { CheckCircle, Home } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';

interface UserStats {
  quizzesTaken: number;
  averageScore: number;
  streakDays: number;
  recentQuizzes: Array<{ id: string; score: number; createdAt: string }>;
  leaderboard: Array<{ id: string; displayName: string; totalScore: number }>;
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    quizzesTaken: 0,
    averageScore: 0,
    streakDays: 0,
    recentQuizzes: [],
    leaderboard: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '');
  const [newPhotoURL, setNewPhotoURL] = useState(user?.photoURL || '');
  const router = useRouter();

  useEffect(() => {
    const fetchUserStats = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/user-stats?userId=${user.id}`);
          const data = await response.json();
          setStats({
            ...data,
            averageScore: data.averageScore.toFixed(2), // Ensure 2 decimal places
          });
        } catch (error) {
          console.error('Error fetching user stats:', error);
          toast.error('Failed to load user statistics');
        }
      }
    };

    fetchUserStats();
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        displayName: newDisplayName,
        photoURL: newPhotoURL,
      });
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-6'>
      <div className='max-w-2xl mx-auto bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-8'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-white text-3xl font-bold'>Profile</h1>
          <button
            onClick={() => router.push('/')}
            className='bg-white bg-opacity-20 text-white rounded-full p-2'
          >
            <Home className='w-6 h-6' />
          </button>
        </div>

        {editMode ? (
          <div className='mb-6'>
            <input
              type='text'
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              className='bg-white bg-opacity-20 text-white rounded-xl p-2 mb-2 w-full'
              placeholder='Display Name'
            />
            <input
              type='text'
              value={newPhotoURL}
              onChange={(e) => setNewPhotoURL(e.target.value)}
              className='bg-white bg-opacity-20 text-white rounded-xl p-2 mb-2 w-full'
              placeholder='Photo URL'
            />
            <button
              onClick={handleUpdateProfile}
              className='bg-green-500 text-white rounded-xl px-4 py-2 mr-2'
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className='bg-red-500 text-white rounded-xl px-4 py-2'
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className='flex items-center mb-6'>
            <Image
              src={user?.photoURL || '/default-avatar.png'}
              alt='Profile'
              width={80}
              height={80}
              className='rounded-full mr-4'
            />
            <div>
              <h2 className='text-white text-2xl font-bold'>
                {user?.displayName}
              </h2>
              <p className='text-white text-lg'>{user?.email}</p>
              {user?.hasAccess && (
                <div className='flex items-center mt-2'>
                  <CheckCircle className='text-green-400 mr-2' />
                  <span className='text-green-400'>Verified</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setEditMode(true)}
              className='bg-blue-500 text-white rounded-xl px-4 py-2 ml-auto'
            >
              Edit Profile
            </button>
          </div>
        )}

        <div className='grid grid-cols-3 gap-4 mb-8'>
          <div className='bg-purple-600 bg-opacity-50 rounded-2xl p-4 text-center'>
            <h3 className='text-white text-lg font-bold mb-2'>Quizzes Taken</h3>
            <p className='text-white text-3xl font-bold'>
              {stats.quizzesTaken}
            </p>
          </div>
          <div className='bg-blue-600 bg-opacity-50 rounded-2xl p-4 text-center'>
            <h3 className='text-white text-lg font-bold mb-2'>Avg. Score</h3>
            <p className='text-white text-3xl font-bold'>
              {stats.averageScore}%
            </p>
          </div>
          <div className='bg-green-600 bg-opacity-50 rounded-2xl p-4 text-center'>
            <h3 className='text-white text-lg font-bold mb-2'>Streak Days</h3>
            <p className='text-white text-3xl font-bold'>{stats.streakDays}</p>
          </div>
        </div>

        <h2 className='text-white text-2xl font-bold mb-4'>Recent Quizzes</h2>
        <ul className='space-y-4 mb-8'>
          {stats.recentQuizzes && stats.recentQuizzes.length > 0 ? (
            stats.recentQuizzes.map((quiz, index) => (
              <li key={index} className='bg-white bg-opacity-20 rounded-xl p-4'>
                <p className='text-white font-bold'>Score: {quiz.score}%</p>
                <p className='text-white text-sm'>
                  {new Date(quiz.createdAt).toLocaleString()}
                </p>
              </li>
            ))
          ) : (
            <li className='text-white'>No recent quizzes found.</li>
          )}
        </ul>

        <h2 className='text-white text-2xl font-bold mb-4'>Leaderboard</h2>
        <ul className='space-y-4'>
          {stats.leaderboard && stats.leaderboard.length > 0 ? (
            stats.leaderboard.map((entry, index) => (
              <li
                key={entry.id}
                className='bg-white bg-opacity-20 rounded-xl p-4 flex justify-between items-center'
              >
                <span className='text-white font-bold'>
                  {index + 1}. {entry.displayName}
                </span>
                <span className='text-white'>{entry.totalScore} points</span>
              </li>
            ))
          ) : (
            <li className='text-white'>No leaderboard data available.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
