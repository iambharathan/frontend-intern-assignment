'use client';

import { useRouter } from 'next/navigation';
import { getUser, clearAuth } from '@/lib/auth';
import { User } from '@/types';
import { useEffect, useState } from 'react';
import { LogOut, CheckSquare, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-900 shadow-lg shadow-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg shadow-purple-500/30">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                TaskFlow Pro
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">Organize • Track • Achieve</p>
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-950/50 rounded-lg border border-gray-900 backdrop-blur-sm">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 text-white font-semibold text-sm shadow-lg shadow-purple-500/30">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-100">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
            )}
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="default"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
