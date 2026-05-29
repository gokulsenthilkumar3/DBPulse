'use client';

import { useConnections } from '@/hooks/useConnections';
import clsx from 'clsx';

const ENGINE_ICON: Record<string, string> = {
  postgres: '🐘',
  mysql: '🐬',
};

interface Props {
  onSelectConnection: (id: string) => void;
  activeId: string | null;
}

export function ConnectionTree({ onSelectConnection, activeId }: Props) {
  const { connections, loading, toggle } = useConnections();

  if (loading) {
    return <div className="p-4 text-slate-500 text-xs">Loading connections…</div>;
  }

  if (connections.length === 0) {
    return (
      <div className="p-4 text-slate-500 text-xs">
        No connections yet.<br />
        <span className="text-brand">POST /api/connections</span> to add one.
      </div>
    );
  }

  return (
    <ul className="flex-1 overflow-y-auto py-2">
      {connections.map((conn) => (
        <li key={conn.id}>
          <button
            onClick={() => onSelectConnection(conn.id)}
            className={clsx(
              'w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-surface-card transition-colors',
              activeId === conn.id && 'bg-surface-card border-l-2 border-brand',
            )}
          >
            <span>{ENGINE_ICON[conn.engine] ?? '🗄️'}</span>
            <span className="flex-1 truncate">{conn.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); toggle(conn.id, conn.status); }}
              className={clsx(
                'w-2 h-2 rounded-full shrink-0',
                conn.status === 'connected' ? 'bg-emerald-400' : 'bg-slate-600',
              )}
              title={conn.status === 'connected' ? 'Disconnect' : 'Connect'}
            />
          </button>
          <div className="px-4 pb-1 text-xs text-slate-500">
            {conn.host} · {conn.database_name}
          </div>
        </li>
      ))}
    </ul>
  );
}
