'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ConnectionTree } from '@/components/ConnectionTree';
import { EventFeed } from '@/components/EventFeed';
import { DiffViewer } from '@/components/DiffViewer';
import { StatsPanel } from '@/components/StatsPanel';
import { AlertRulesPanel } from '@/components/AlertRulesPanel';
import { useAuditStream } from '@/hooks/useAuditStream';
import type { AuditEvent } from '@dbpulse/shared';

type Tab = 'events' | 'stats' | 'alerts';

export default function HomePage() {
  const { isAuthenticated, signOut } = useAuth();
  const router = useRouter();

  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('events');
  const { events, connected, clearEvents } = useAuditStream(activeConnectionId);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-surface-border flex flex-col">
        <div className="px-4 py-3 border-b border-surface-border flex items-center gap-2">
          <span className="text-brand font-bold text-base tracking-tight">⚡ DBPulse</span>
          <span className={`ml-auto w-2 h-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-slate-600'}`}
            title={connected ? 'Stream connected' : 'Stream disconnected'} />
        </div>
        <ConnectionTree
          onSelectConnection={(id) => { setActiveConnectionId(id); clearEvents(); }}
          activeId={activeConnectionId}
        />
        <div className="mt-auto px-4 py-3 border-t border-surface-border">
          <button
            onClick={signOut}
            className="w-full text-xs text-slate-500 hover:text-rose-400 transition-colors text-left"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Tab bar */}
        <div className="flex items-center gap-0 border-b border-surface-border px-4">
          {(['events', 'stats', 'alerts'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-xs uppercase tracking-widest transition-colors border-b-2 ${
                tab === t
                  ? 'border-brand text-slate-100'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
          {tab === 'events' && events.length > 0 && (
            <button
              onClick={clearEvents}
              className="ml-auto text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              Clear ({events.length})
            </button>
          )}
        </div>

        {/* Tab content */}
        {tab === 'events' && (
          <div className="flex flex-1 min-h-0">
            <div className="flex-1 border-r border-surface-border flex flex-col min-w-0">
              <EventFeed events={events} onSelect={setSelectedEvent} selectedId={selectedEvent?.id} />
            </div>
            <aside className="w-96 shrink-0 flex flex-col">
              <div className="px-4 py-3 border-b border-surface-border text-slate-400 text-xs uppercase tracking-widest">
                Event Detail
              </div>
              <DiffViewer event={selectedEvent} />
            </aside>
          </div>
        )}

        {tab === 'stats' && (
          <StatsPanel connectionId={activeConnectionId} />
        )}

        {tab === 'alerts' && (
          <AlertRulesPanel connectionId={activeConnectionId} />
        )}
      </div>
    </div>
  );
}
