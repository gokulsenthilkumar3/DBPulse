// ─── MySQLConnector (stub) ────────────────────────────────────────────────────
// Implements IConnector using MySQL binlog streaming.
// TODO: Replace stub methods with real mysql2 + binlog integration.

import { IConnector, AuditEvent, ConnectionConfig } from '@dbpulse/shared';

export class MySQLConnector implements IConnector {
  private config: ConnectionConfig;
  private listening = false;

  constructor(config: ConnectionConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    // TODO: initialise mysql2 pool with this.config
    console.log(`[MySQLConnector] Connecting to ${this.config.host}:${this.config.port}/${this.config.database}`);
  }

  async disconnect(): Promise<void> {
    this.listening = false;
    // TODO: pool.end()
    console.log('[MySQLConnector] Disconnected.');
  }

  async startListening(onEvent: (event: AuditEvent) => void): Promise<void> {
    this.listening = true;
    // TODO: attach to binlog stream (ZongJi or similar)
    console.log('[MySQLConnector] Listening for binlog events...');
  }

  async stopListening(): Promise<void> {
    this.listening = false;
    console.log('[MySQLConnector] Stopped listening.');
  }

  async ping(): Promise<boolean> {
    // TODO: SELECT 1
    return true;
  }
}
