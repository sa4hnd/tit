'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithEmail } = useAuth();
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      router.push('/');
    } catch (error) {
      console.error('Error signing in with email:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log('Attempting Google Sign-In');
      const user = await signIn();
      console.log('Sign-In successful, user:', user);
      if (user) {
        console.log('Redirecting to home page');
        router.push('/');
      } else {
        console.error('Sign in successful but no user returned');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      // Show error message to user
      toast.error('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 p-6 flex flex-col'>
      <header className='flex justify-between items-center mb-8'>
        <Link href="/">
          <h1 className='text-white text-4xl font-bold'>Fergeh</h1>
        </Link>
      </header>
      <main className='flex-grow flex items-center justify-center'>
        <div className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-8 w-full max-w-md'>
          <h2 className='text-white text-3xl font-bold mb-6 text-center'>Sign In</h2>
          <form onSubmit={handleEmailSignIn} className='space-y-4 mb-6'>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-white bg-opacity-20 text-white placeholder-gray-300'
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='bg-white bg-opacity-20 text-white placeholder-gray-300'
            />
            <Button type="submit" className='w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-2xl transition-transform transform hover:scale-105'>
              Sign In with Email
            </Button>
          </form>
          <div className='relative mb-6'>
            <hr className='border-t border-gray-300' />
            <span className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent px-2 text-white text-sm'>
              or
            </span>
          </div>
          <Button
            onClick={handleGoogleSignIn}
            className='w-full flex items-center justify-center space-x-2 bg-white text-gray-800 hover:bg-gray-100 font-bold py-3 rounded-2xl transition-transform transform hover:scale-105'
          >
            <FcGoogle size={20} />
            <span>Sign In with Google</span>
          </Button>
        </div>
      </main>
    </div>
  );
}