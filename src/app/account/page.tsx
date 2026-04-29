'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';
import Link from 'next/link';

export default function AccountPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { router.push('/login'); return; }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserInfo(payload);
    } catch {
      router.push('/login');
    }
  }, [router]);

  async function handleLogout() {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Version': '1' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch {}
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  }

  if (!userInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Insighta Labs+
          </h1>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/profiles" className="text-gray-400 hover:text-white transition-colors">Profiles</Link>
            <Link href="/search" className="text-gray-400 hover:text-white transition-colors">Search</Link>
            <Link href="/account" className="text-blue-400 font-medium">Account</Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="text-2xl font-bold mb-8">Account</h2>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-8">
          <div className="space-y-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">GitHub ID</p>
              <p className="text-gray-200 font-mono">{userInfo.sub}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Role</p>
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                userInfo.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {userInfo.role}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Token Expires</p>
              <p className="text-gray-200">{new Date(userInfo.exp * 1000).toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <button onClick={handleLogout}
              className="rounded-lg bg-red-600/80 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
