'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/api';

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('Authenticating...');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (!code) {
      setStatus('Error: No authorization code received.');
      return;
    }

    // RELAY LOGIC: If this is a CLI login, bridge the code back to localhost
    if (state && state.startsWith('cli-')) {
      setStatus('Login successful! Redirecting back to your terminal...');
      window.location.href = `http://localhost:9876/callback?code=${code}&state=${state}`;
      return;
    }

    async function exchangeCode() {
      try {
        const response = await fetch(`${API_BASE}/auth/github/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Version': '1',
          },
          body: JSON.stringify({ code, state }),
          credentials: 'include',
        });

        const data = await response.json();

        if (data.status === 'success') {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          setStatus('Success! Redirecting...');
          router.push('/dashboard');
        } else {
          setStatus(`Login failed: ${data.message || 'Unknown error'}`);
        }
      } catch (err: any) {
        setStatus(`Error: ${err.message}`);
      }
    }

    exchangeCode();
  }, [searchParams, router]);

  return <p className="text-gray-400">{status}</p>;
}

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-blue-400"></div>
        <Suspense fallback={<p className="text-gray-400">Loading...</p>}>
          <CallbackHandler />
        </Suspense>
      </div>
    </div>
  );
}
