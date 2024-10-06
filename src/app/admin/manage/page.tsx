'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { withAdminAuth } from '@/components/withAdminAuth';

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: string;
  isBanned: boolean;
  hasAccess: boolean;
  streakDays: number;
  quizzesTaken: number;
  totalScore: number;
}

function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.users);
      setTotalUsers(data.totalUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const toggleUserBan = async (userId: string, isBanned: boolean) => {
    try {
      const response = await fetch('/api/users/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isBanned: !isBanned }),
      });
      if (response.ok) {
        fetchUsers();
        toast.success(`User ${isBanned ? 'unbanned' : 'banned'} successfully`);
      } else {
        throw new Error('Failed to update user ban status');
      }
    } catch (error) {
      console.error('Error updating user ban status:', error);
      toast.error('Failed to update user ban status');
    }
  };

  const toggleUserAccess = async (userId: string, hasAccess: boolean) => {
    try {
      const response = await fetch('/api/users/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, hasAccess: !hasAccess }),
      });
      if (response.ok) {
        fetchUsers();
        toast.success(
          `User access ${hasAccess ? 'removed' : 'granted'} successfully`
        );
      } else {
        throw new Error('Failed to update user access status');
      }
    } catch (error) {
      console.error('Error updating user access status:', error);
      toast.error('Failed to update user access status');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-6'>
      <h1 className='text-white text-4xl font-bold mb-8'>Manage Users</h1>
      <p className='text-white text-xl mb-4'>Total Users: {totalUsers}</p>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {users.map((user) => (
          <div
            key={user.id}
            className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-6'
          >
            <div className='flex items-center mb-4'>
              <Image
                src={user.photoURL || '/default-avatar.png'}
                alt={user.displayName || 'User'}
                width={50}
                height={50}
                className='rounded-full mr-4'
              />
              <div>
                <h2 className='text-white text-xl font-bold'>
                  {user.displayName || 'Anonymous'}
                </h2>
                <p className='text-gray-300'>{user.email}</p>
              </div>
            </div>
            <p className='text-gray-300 mb-2'>
              Created: {new Date(user.createdAt).toLocaleDateString()}
            </p>
            <p className='text-gray-300 mb-2'>Streak: {user.streakDays} days</p>
            <p className='text-gray-300 mb-2'>
              Quizzes Taken: {user.quizzesTaken}
            </p>
            <p className='text-gray-300 mb-2'>Total Score: {user.totalScore}</p>
            <div className='flex justify-between items-center mt-4'>
              <Button
                onClick={() => toggleUserBan(user.id, user.isBanned)}
                variant={user.isBanned ? 'destructive' : 'default'}
              >
                {user.isBanned ? 'Unban' : 'Ban'} User
              </Button>
              <Button
                onClick={() => toggleUserAccess(user.id, user.hasAccess)}
                variant={user.hasAccess ? 'default' : 'secondary'}
              >
                {user.hasAccess ? 'Remove Access' : 'Grant Access'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAdminAuth(ManageUsersPage);
