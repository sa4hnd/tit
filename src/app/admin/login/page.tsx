'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useAuth } from '@/contexts/AuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { signIn, signInWithEmail } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      router.push(redirect);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to log in. Please check your credentials.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn();
      router.push(redirect);
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in with Google.');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 flex items-center justify-center p-6'>
      <div className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-8 w-full max-w-md'>
        <h1 className='text-white text-3xl font-bold mb-6 text-center'>
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-white bg-opacity-20 text-white placeholder-gray-300'
          />
          <Input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='bg-white bg-opacity-20 text-white placeholder-gray-300'
          />
          <Button
            type='submit'
            className='w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 rounded-2xl transition-transform transform hover:scale-105'
          >
            Login
          </Button>
        </form>
        <div className='mt-4'>
          <Button
            onClick={handleGoogleSignIn}
            className='w-full bg-white text-gray-800 font-bold py-3 rounded-2xl transition-transform transform hover:scale-105 flex items-center justify-center'
          >
            <FcGoogle className='mr-2' size={20} />
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
