'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err?.message ?? 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-surface">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-brand">⚡ DBPulse</span>
          <p className="text-slate-500 text-sm mt-1">Real-time database audit</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-card border border-surface-border rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm outline-none focus:border-brand transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-sm outline-none focus:border-brand transition-colors"
            />
          </div>

          {error && (
            <p className="text-rose-400 text-xs bg-rose-950/40 border border-rose-900 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-dark py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
