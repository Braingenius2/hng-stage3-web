'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';
import Link from 'next/link';

export default function SearchPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('access_token');
    if (!t) { router.push('/login'); return; }
    setToken(t);
  }, [router]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || !token) return;

    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams({ q: query, page: '1', limit: '10' });
      const res = await fetch(`${API_BASE}/api/profiles/search?${params}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'X-API-Version': '1' },
      });
      const data = await res.json();
      setProfiles(data.data || []);
      setMeta(data.meta || null);
    } catch {
      setProfiles([]);
    }
    setLoading(false);
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
            <Link href="/search" className="text-blue-400 font-medium">Search</Link>
            <Link href="/account" className="text-gray-400 hover:text-white transition-colors">Account</Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">Search Profiles</h2>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder='Try "young males from nigeria" or "senior females"'
            className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none" />
          <button type="submit" disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-blue-400"></div>
          </div>
        )}

        {!loading && searched && profiles.length === 0 && (
          <p className="text-gray-500 py-10 text-center">No profiles found matching your query.</p>
        )}

        {!loading && profiles.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-900 text-gray-400 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Gender</th>
                  <th className="px-4 py-3 font-medium">Age</th>
                  <th className="px-4 py-3 font-medium">Country</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {profiles.map((p: any) => (
                  <tr key={p.id} className="hover:bg-gray-900/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-200">{p.name}</td>
                    <td className="px-4 py-3 capitalize text-gray-400">{p.gender}</td>
                    <td className="px-4 py-3 text-gray-400">{p.age}</td>
                    <td className="px-4 py-3 text-gray-400">{p.country_id}</td>
                    <td className="px-4 py-3">
                      <Link href={`/profiles/${p.id}`} className="text-blue-400 hover:text-blue-300 text-xs font-medium">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta && (
          <p className="mt-4 text-sm text-gray-500">
            Found {meta.total_elements} results across {meta.total_pages} pages
          </p>
        )}
      </main>
    </div>
  );
}
