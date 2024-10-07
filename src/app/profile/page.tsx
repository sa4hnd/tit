'use client';

import { CheckCircle, Home, Camera, LogOut } from 'lucide-react';
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
  leaderboard: Array<{ id: string; displayName: string; averageScore: number }>;
}

export default function ProfilePage() {
  const { user, updateProfile, signOut } = useAuth();
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
  const [imageFile, setImageFile] = useState<File | null>(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      let photoURL = user?.photoURL;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadResponse = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const { imageUrl } = await uploadResponse.json();
        photoURL = imageUrl;
      }

      await updateProfile({
        displayName: newDisplayName,
        photoURL: photoURL,
      });

      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-4 sm:p-6'>
      <div className='max-w-2xl mx-auto bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-4 sm:p-8'>
        <div className='flex flex-col sm:flex-row justify-between items-center mb-6'>
          <h1 className='text-white text-3xl font-bold mb-4 sm:mb-0'>
            Profile
          </h1>
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
            <div className='relative mb-2'>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='hidden'
                id='image-upload'
              />
              <label
                htmlFor='image-upload'
                className='bg-white bg-opacity-20 text-white rounded-xl p-2 w-full flex items-center justify-center cursor-pointer'
              >
                <Camera className='mr-2' />
                {imageFile ? 'Change Image' : 'Upload Image'}
              </label>
              {imageFile && (
                <p className='text-white text-sm mt-1'>{imageFile.name}</p>
              )}
            </div>
            <div className='flex flex-col sm:flex-row gap-2'>
              <button
                onClick={handleUpdateProfile}
                className='bg-green-500 text-white rounded-xl px-4 py-2 active:bg-green-600 transition-colors duration-200 touch-manipulation'
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className='bg-red-500 text-white rounded-xl px-4 py-2 active:bg-red-600 transition-colors duration-200 touch-manipulation'
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className='flex flex-col sm:flex-row items-center mb-6'>
            <Image
              src={user?.photoURL || '/default-avatar.png'}
              alt='Profile'
              width={80}
              height={80}
              className='rounded-full mb-4 sm:mb-0 sm:mr-4'
            />
            <div className='text-center sm:text-left'>
              <h2 className='text-white text-2xl font-bold'>
                {user?.displayName}
              </h2>
              <p className='text-white text-lg'>{user?.email}</p>
              {user?.hasAccess && (
                <div className='flex items-center justify-center sm:justify-start mt-2'>
                  <CheckCircle className='text-green-400 mr-2' />
                  <span className='text-green-400'>Verified</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setEditMode(true)}
              className='bg-blue-500 text-white rounded-xl px-4 py-2 mt-4 sm:mt-0 sm:ml-auto active:bg-blue-600 transition-colors duration-200 touch-manipulation'
            >
              Edit Profile
            </button>
          </div>
        )}

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8'>
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
        <ul className='space-y-4 mb-6'>
          {stats.leaderboard && stats.leaderboard.length > 0 ? (
            stats.leaderboard.map((entry, index) => (
              <li
                key={entry.id}
                className='bg-white bg-opacity-20 rounded-xl p-4 flex justify-between items-center'
              >
                <span className='text-white font-bold'>
                  {index + 1}. {entry.displayName}
                </span>
                <span className='text-white'>
                  {entry.averageScore.toFixed(2)}%
                </span>
              </li>
            ))
          ) : (
            <li className='text-white'>No leaderboard data available.</li>
          )}
        </ul>

        <div className='flex justify-between'>
          <button
            onClick={() => router.push('/')}
            className='bg-white bg-opacity-20 text-white rounded-full p-2'
          >
            <Home className='w-6 h-6' />
          </button>
          <button
            onClick={handleSignOut}
            className='bg-red-500 bg-opacity-20 text-white rounded-full p-2 flex items-center'
          >
            <LogOut className='w-6 h-6 mr-2' />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
