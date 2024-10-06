'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  User as FirebaseUser,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { prisma } from '@/lib/prisma';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

interface AuthContextType {
  user: (FirebaseUser & { id: string; isAdmin: boolean }) | null;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
  hasAccess: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<(FirebaseUser & { id: string; isAdmin: boolean; hasAccess: boolean }) | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
      if (firebaseUser) {
        try {
          console.log('Fetching user data from database');
          const response = await fetch(`/api/auth/user?firebaseUid=${firebaseUser.uid}`);
          const dbUser = await response.json();
          console.log('User data fetched:', dbUser);
          setUser({ ...firebaseUser, id: dbUser.id, isAdmin: dbUser.isAdmin, hasAccess: dbUser.hasAccess });
          setHasAccess(dbUser.hasAccess || process.env.NEXT_PUBLIC_ALLOW_ALL_SIGNUPS === 'true');
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setHasAccess(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      console.log('Initiating Google Sign-In');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Google Sign-In successful');
      return result.user;
    } catch (error) {
      console.error('Error in signIn function:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      console.log('Signing in with email');
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Email sign-in successful');
      return result.user;
    } catch (error) {
      console.error('Error in signInWithEmail function:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out');
      await auth.signOut();
      console.log('Sign-out successful');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (user) {
      await firebaseUpdateProfile(user, data);
      // Update user in MySQL via API
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: user.uid,
          ...data,
        }),
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signInWithEmail, signOut, updateProfile, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}