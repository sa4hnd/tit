'use client';

import { CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className='bg-gradient-to-r from-purple-700 via-indigo-800 to-blue-900 p-4'>
      <nav className='container mx-auto flex justify-between items-center'>
        <Link href='/' className='text-white text-2xl font-bold'>
          Quiz App
        </Link>
        <div className='space-x-4'>
          {user ? (
            <>
              <Link href='/profile'>
                <Button variant='ghost' className='text-white'>
                  Profile
                  {user.hasAccess && (
                    <CheckCircle className='ml-2 h-4 w-4 text-green-400' />
                  )}
                  {!user.hasAccess && (
                    <Clock className='ml-2 h-4 w-4 text-yellow-400' />
                  )}
                </Button>
              </Link>
              {user.isAdmin && (
                <Link href='/admin'>
                  <Button variant='ghost' className='text-white'>
                    Admin
                  </Button>
                </Link>
              )}
              <Button onClick={signOut} variant='ghost' className='text-white'>
                Sign Out
              </Button>
            </>
          ) : (
            <Link href='/login'>
              <Button variant='ghost' className='text-white'>
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
