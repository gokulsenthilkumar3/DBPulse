'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export interface Connection {
  id: string;
  name: string;
  engine: 'postgres' | 'mysql';
  host: string;
  database_name: string;
  status: 'connected' | 'disconnected';
}

export function useConnections() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const res = await fetch(`${API_URL}/api/connections`);
    const data = await res.json();
    setConnections(data);
    setLoading(false);
  };

  const toggle = async (id: string, currentStatus: string) => {
    const method = currentStatus === 'connected' ? 'DELETE' : 'POST';
    await fetch(`${API_URL}/api/connections/${id}/connect`, { method });
    await refresh();
  };

  useEffect(() => { refresh(); }, []);
  return { connections, loading, refresh, toggle };
}
