// ─── Connection Config ───────────────────────────────────────────────────────

export type DbEngine = 'postgres' | 'mysql';

export interface ConnectionConfig {
  id: string;
  name: string;
  engine: DbEngine;
  host: string;
  port: number;
  database: string;
  username: string;
  /** Encrypted at rest; never log this field */
  password: string;
  ssl?: boolean;
}

// ─── Audit Event ─────────────────────────────────────────────────────────────

export type DmlOperation = 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE';

export interface AuditEvent {
  id: string;
  connectionId: string;
  databaseName: string;
  schemaName?: string;
  tableName: string;
  operation: DmlOperation;
  actor: string;
  sessionInfo?: Record<string, unknown>;
  beforeState?: Record<string, unknown> | null;
  afterState?: Record<string, unknown> | null;
  diffColumns?: string[];
  rawQuery?: string;
  eventHash?: string;
  createdAt: string; // ISO 8601
}

// ─── Connector Interface ─────────────────────────────────────────────────────

export interface IConnector {
  /** Establish connection to the target database */
  connect(): Promise<void>;

  /** Gracefully close the connection */
  disconnect(): Promise<void>;

  /** Begin streaming audit events; callback fires on each captured event */
  startListening(onEvent: (event: AuditEvent) => void): Promise<void>;

  /** Stop listening without closing the connection */
  stopListening(): Promise<void>;

  /** Health-check — resolves true if connection is alive */
  ping(): Promise<boolean>;
}
