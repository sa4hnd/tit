'use client';

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';

import { auth, googleProvider } from '@/lib/firebase';

// Define a custom user type that extends FirebaseUser
type CustomUser = FirebaseUser & {
  id: string;
  isAdmin: boolean;
  hasAccess: boolean;
};

interface AuthContextType {
  user: CustomUser | null;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: {
    displayName?: string;
    photoURL?: string;
  }) => Promise<void>;
  hasAccess: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const response = await fetch('/api/auth/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firebaseUid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to sync user data with Prisma');
          }

          const userData = await response.json();
          setUser({
            ...firebaseUser,
            id: userData.id,
            isAdmin: userData.isAdmin,
            hasAccess: userData.hasAccess,
          } as CustomUser);
          setHasAccess(userData.hasAccess);
        } catch (error) {
          console.error('Error syncing user data:', error);
        }
      } else {
        setUser(null);
        setHasAccess(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setHasAccess(false);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateProfile = async (data: {
    displayName?: string;
    photoURL?: string;
  }) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        await firebaseUpdateProfile(currentUser, data);
        // Update user in MySQL via API
        await fetch('/api/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firebaseUid: currentUser.uid,
            ...data,
          }),
        });
        // Update local user state
        setUser((prevUser) => {
          if (prevUser) {
            return {
              ...prevUser,
              displayName: data.displayName || prevUser.displayName,
              photoURL: data.photoURL || prevUser.photoURL,
            };
          }
          return prevUser;
        });
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    } else {
      console.error('No user is currently signed in');
      throw new Error('No user is currently signed in');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signInWithEmail,
        signOut,
        updateProfile,
        hasAccess,
      }}
    >
      {!loading && children}
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
