'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';
import Link from 'next/link';

async function fetchWithAuth(path: string, token: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Authorization': `Bearer ${token}`, 'X-API-Version': '1' },
  });
  return res.json();
}

export default function ProfilesPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [ageGroup, setAgeGroup] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('access_token');
    if (!t) { router.push('/login'); return; }
    setToken(t);
  }, [router]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);

    const params = new URLSearchParams({ page: String(page), limit: '10' });
    if (gender) params.append('gender', gender);
    if (country) params.append('country_id', country);
    if (ageGroup) params.append('age_group', ageGroup);

    fetchWithAuth(`/api/profiles?${params}`, token).then((data) => {
      setProfiles(data.data || []);
      setMeta(data.meta || null);
      setLoading(false);
    });
  }, [token, page, gender, country, ageGroup]);

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

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">Profiles</h2>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <select value={gender} onChange={(e) => { setGender(e.target.value); setPage(1); }}
            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-300 focus:border-blue-500 focus:outline-none">
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select value={ageGroup} onChange={(e) => { setAgeGroup(e.target.value); setPage(1); }}
            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-300 focus:border-blue-500 focus:outline-none">
            <option value="">All Age Groups</option>
            <option value="child">Child</option>
            <option value="teen">Teen</option>
            <option value="young_adult">Young Adult</option>
            <option value="adult">Adult</option>
            <option value="middle_aged">Middle Aged</option>
            <option value="senior">Senior</option>
          </select>
          <input type="text" placeholder="Country ID (e.g. NG)" value={country}
            onChange={(e) => { setCountry(e.target.value.toUpperCase()); setPage(1); }}
            className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-300 placeholder-gray-500 focus:border-blue-500 focus:outline-none w-40" />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-blue-400"></div>
          </div>
        ) : profiles.length === 0 ? (
          <p className="text-gray-500 py-10 text-center">No profiles found.</p>
        ) : (
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

        {/* Pagination */}
        {meta && (
          <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
            <p>Page {meta.page} of {meta.total_pages} ({meta.total_elements} total)</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
                className="rounded-lg bg-gray-800 px-4 py-2 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Previous
              </button>
              <button onClick={() => setPage(page + 1)} disabled={page >= (meta.total_pages || 1)}
                className="rounded-lg bg-gray-800 px-4 py-2 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
