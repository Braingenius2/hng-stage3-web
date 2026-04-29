'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_BASE } from '@/lib/api';
import Link from 'next/link';

export default function ProfileDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { router.push('/login'); return; }

    fetch(`${API_BASE}/api/profiles/${params.id}`, {
      headers: { 'Authorization': `Bearer ${token}`, 'X-API-Version': '1' },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data.data || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-blue-400"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <p className="text-gray-400">Profile not found.</p>
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
            <Link href="/profiles" className="text-blue-400 font-medium">Profiles</Link>
            <Link href="/search" className="text-gray-400 hover:text-white transition-colors">Search</Link>
            <Link href="/account" className="text-gray-400 hover:text-white transition-colors">Account</Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/profiles" className="text-sm text-blue-400 hover:text-blue-300 mb-6 inline-block">
          ← Back to Profiles
        </Link>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-8">
          <h2 className="text-2xl font-bold mb-6">{profile.name}</h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Gender</p>
              <p className="text-gray-200 capitalize">{profile.gender} ({(profile.gender_probability * 100).toFixed(0)}%)</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Age</p>
              <p className="text-gray-200">{profile.age} ({profile.age_group})</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Country</p>
              <p className="text-gray-200">{profile.country_name} [{profile.country_id}] ({(profile.country_probability * 100).toFixed(0)}%)</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Created</p>
              <p className="text-gray-200">{new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Profile ID</p>
            <p className="text-gray-400 text-sm font-mono">{profile.id}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
