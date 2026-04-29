'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';
import Link from 'next/link';

function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    setToken(localStorage.getItem('access_token'));
  }, []);
  return token;
}

async function fetchWithAuth(path: string, token: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-API-Version': '1',
    },
    cache: 'no-store',
  });
  return res.json();
}

export default function DashboardPage() {
  const token = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token === null) return; // still checking
    if (!token) { router.push('/login'); return; }

    async function loadStats() {
      try {
        const data = await fetchWithAuth('/api/profiles?page=1&limit=1', token!);
        setStats({
          total: data.meta?.total_elements || 0,
          totalPages: data.meta?.total_pages || 0,
        });
      } catch {
        setStats({ total: 0, totalPages: 0 });
      }
      setLoading(false);
    }
    loadStats();
  }, [token, router]);

  // Decode JWT to get user info
  let userInfo: any = {};
  try {
    if (token) {
      userInfo = JSON.parse(atob(token.split('.')[1]));
    }
  } catch {}

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Insighta Labs+
          </h1>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="text-blue-400 font-medium">Dashboard</Link>
            <Link href="/profiles" className="text-gray-400 hover:text-white transition-colors">Profiles</Link>
            <Link href="/search" className="text-gray-400 hover:text-white transition-colors">Search</Link>
            <Link href="/account" className="text-gray-400 hover:text-white transition-colors">Account</Link>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Profiles */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Total Profiles</p>
            <p className="text-4xl font-bold text-blue-400">{stats?.total ?? 0}</p>
          </div>

          {/* Role */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Your Role</p>
            <p className="text-4xl font-bold capitalize text-purple-400">{userInfo.role || 'analyst'}</p>
          </div>

          {/* Total Pages */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Total Pages</p>
            <p className="text-4xl font-bold text-emerald-400">{stats?.totalPages ?? 0}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/profiles" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
              Browse Profiles
            </Link>
            <Link href="/search" className="rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors">
              Search Profiles
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
