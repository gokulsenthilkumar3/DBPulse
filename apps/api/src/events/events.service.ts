import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuditEvent } from '@dbpulse/shared';
import { computeDiff } from '@dbpulse/diff-engine';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  private readonly supabase: SupabaseClient;

  constructor(private config: ConfigService) {
    this.supabase = createClient(
      this.config.getOrThrow('SUPABASE_URL'),
      this.config.getOrThrow('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  /** Persist an AuditEvent and return the saved row */
  async saveEvent(event: AuditEvent): Promise<AuditEvent> {
    const diff = computeDiff(
      event.beforeState ?? null,
      event.afterState ?? null,
    );

    const { data, error } = await this.supabase
      .from('audit_events')
      .insert({
        connection_id: event.connectionId,
        database_name: event.databaseName,
        schema_name: event.schemaName,
        table_name: event.tableName,
        operation: event.operation,
        actor: event.actor,
        session_info: event.sessionInfo,
        before_state: event.beforeState,
        after_state: event.afterState,
        diff_columns: diff.changedColumns,
        raw_query: event.rawQuery,
        event_hash: event.eventHash,
      })
      .select()
      .single();

    if (error) {
      this.logger.error(`Failed to save event: ${error.message}`);
      throw new Error(error.message);
    }

    return this.mapRow(data);
  }

  /** Query audit events with optional filters */
  async queryEvents(filters: {
    connectionId?: string;
    tableName?: string;
    actor?: string;
    limit?: number;
    offset?: number;
  }): Promise<AuditEvent[]> {
    let query = this.supabase
      .from('audit_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(filters.limit ?? 50);

    if (filters.connectionId) query = query.eq('connection_id', filters.connectionId);
    if (filters.tableName) query = query.eq('table_name', filters.tableName);
    if (filters.actor) query = query.eq('actor', filters.actor);
    if (filters.offset) query = query.range(filters.offset, (filters.offset + (filters.limit ?? 50)) - 1);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []).map(this.mapRow);
  }

  private mapRow(row: any): AuditEvent {
    return {
      id: row.id,
      connectionId: row.connection_id,
      databaseName: row.database_name,
      schemaName: row.schema_name,
      tableName: row.table_name,
      operation: row.operation,
      actor: row.actor,
      sessionInfo: row.session_info,
      beforeState: row.before_state,
      afterState: row.after_state,
      diffColumns: row.diff_columns,
      rawQuery: row.raw_query,
      eventHash: row.event_hash,
      createdAt: row.created_at,
    };
  }
}
