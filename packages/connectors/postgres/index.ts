// ─── PostgresConnector (stub) ─────────────────────────────────────────────────
// Implements IConnector using PostgreSQL logical replication / LISTEN-NOTIFY.
// TODO: Replace stub methods with real pg-logical / wal2json integration.

import { IConnector, AuditEvent, ConnectionConfig } from '@dbpulse/shared';

export class PostgresConnector implements IConnector {
  private config: ConnectionConfig;
  private listening = false;

  constructor(config: ConnectionConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    // TODO: initialise pg.Pool with this.config
    console.log(`[PostgresConnector] Connecting to ${this.config.host}:${this.config.port}/${this.config.database}`);
  }

  async disconnect(): Promise<void> {
    this.listening = false;
    // TODO: pool.end()
    console.log('[PostgresConnector] Disconnected.');
  }

  async startListening(onEvent: (event: AuditEvent) => void): Promise<void> {
    this.listening = true;
    // TODO: attach to logical replication slot or trigger-based NOTIFY
    console.log('[PostgresConnector] Listening for events...');
  }

  async stopListening(): Promise<void> {
    this.listening = false;
    console.log('[PostgresConnector] Stopped listening.');
  }

  async ping(): Promise<boolean> {
    // TODO: SELECT 1
    return true;
  }
}
