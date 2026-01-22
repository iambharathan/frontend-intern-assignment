'use client';

import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Protect the dashboard route
  useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-950">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
