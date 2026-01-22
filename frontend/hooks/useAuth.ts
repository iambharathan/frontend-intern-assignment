'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

/**
 * Hook to protect routes - redirects if not authenticated
 */
export function useAuth(requireAuth: boolean = true) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();

      // If route requires auth but user is not authenticated
      if (requireAuth && !isAuth) {
        router.push('/login');
        return;
      }

      // If user is authenticated and on login/register page
      if (isAuth && (pathname === '/login' || pathname === '/register')) {
        router.push('/dashboard');
        return;
      }
    };

    checkAuth();
  }, [requireAuth, pathname, router]);
}
