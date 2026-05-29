'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { AuditEvent } from '@dbpulse/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const MAX_EVENTS = 200;

export function useAuditStream(connectionId: string | null) {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(`${API_URL}/stream`, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('audit_event', (event: AuditEvent) => {
      if (connectionId && event.connectionId !== connectionId) return;
      setEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS));
    });

    if (connectionId) socket.emit('subscribe', connectionId);

    return () => { socket.disconnect(); };
  }, [connectionId]);

  return { events, connected };
}
