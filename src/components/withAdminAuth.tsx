'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';

export function withAdminAuth(WrappedComponent: React.ComponentType) {
  return function WithAdminAuth(props: any) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { user, signIn } = useAuth();

    useEffect(() => {
      const checkAdminStatus = async () => {
        if (!user) {
          console.log('No user found, redirecting to login');
          router.push(`/admin/login?redirect=${pathname}`);
          return;
        }

        try {
          console.log('Checking admin status for user:', user.email);
          const response = await fetch(`/api/auth/user?email=${user.email}`);
          const userData = await response.json();

          if (userData.isAdmin) {
            console.log('User is admin, granting access');
            setIsAuthenticated(true);
          } else {
            console.log('User is not admin, redirecting to home');
            toast.error('You do not have admin privileges');
            router.push('/');
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          toast.error('An error occurred while checking admin status');
          router.push('/');
        }
      };

      checkAdminStatus();
    }, [user, router, signIn, pathname]);

    if (!isAuthenticated) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
}
