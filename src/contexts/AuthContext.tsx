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

// Remove these lines as they're already handled in @/lib/firebase
// const firebaseConfig = { ... };
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

interface AuthContextType {
  user: (FirebaseUser & { id: string; isAdmin: boolean }) | null;
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
  const [user, setUser] = useState<User | null>(null);
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
            hasAccess: userData.hasAccess, // Ensure this is being set correctly
          });
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

  const signOut = () => {
    firebaseSignOut(auth).then(() => {
      setUser(null);
      setHasAccess(false);
    });
  };

  const updateProfile = async (data: {
    displayName?: string;
    photoURL?: string;
  }) => {
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
