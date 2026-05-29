'use client';

import { useState } from 'react';
import { ConnectionTree } from '@/components/ConnectionTree';
import { EventFeed } from '@/components/EventFeed';
import { DiffViewer } from '@/components/DiffViewer';
import { useAuditStream } from '@/hooks/useAuditStream';
import type { AuditEvent } from '@dbpulse/shared';

export default function HomePage() {
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);
  const { events, connected } = useAuditStream(activeConnectionId);

  return (
    <div className="flex h-full">
      {/* Sidebar — Tree View */}
      <aside className="w-64 shrink-0 border-r border-surface-border flex flex-col">
        <div className="px-4 py-3 border-b border-surface-border flex items-center gap-2">
          <span className="text-brand font-bold text-base tracking-tight">⚡ DBPulse</span>
          <span className={`ml-auto w-2 h-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-slate-600'}`} />
        </div>
        <ConnectionTree onSelectConnection={setActiveConnectionId} activeId={activeConnectionId} />
      </aside>

      {/* Main — Event Feed */}
      <main className="flex-1 flex flex-col min-w-0 border-r border-surface-border">
        <div className="px-4 py-3 border-b border-surface-border text-slate-400 text-xs uppercase tracking-widest">
          Event Feed {activeConnectionId ? `· ${events.length} events` : '· select a connection'}
        </div>
        <EventFeed events={events} onSelect={setSelectedEvent} selectedId={selectedEvent?.id} />
      </main>

      {/* Right Panel — Diff Viewer */}
      <aside className="w-96 shrink-0 flex flex-col">
        <div className="px-4 py-3 border-b border-surface-border text-slate-400 text-xs uppercase tracking-widest">
          Event Detail
        </div>
        <DiffViewer event={selectedEvent} />
      </aside>
    </div>
  );
}
