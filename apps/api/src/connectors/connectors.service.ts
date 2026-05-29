import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConnectionConfig, IConnector } from '@dbpulse/shared';
import { PostgresConnector } from '@dbpulse/connector-postgres';
import { MySQLConnector } from '@dbpulse/connector-mysql';

@Injectable()
export class ConnectorsService {
  private readonly logger = new Logger(ConnectorsService.name);
  private readonly supabase: SupabaseClient;
  /** Live connector instances keyed by connectionId */
  private readonly activeConnectors = new Map<string, IConnector>();

  constructor(private config: ConfigService) {
    this.supabase = createClient(
      this.config.getOrThrow('SUPABASE_URL'),
      this.config.getOrThrow('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  /** Fetch all saved connections from Supabase */
  async listConnections() {
    const { data, error } = await this.supabase
      .from('db_connections')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  /** Save a new connection record */
  async createConnection(payload: Omit<ConnectionConfig, 'id'>) {
    const { data, error } = await this.supabase
      .from('db_connections')
      .insert({
        name: payload.name,
        engine: payload.engine,
        host: payload.host,
        port: payload.port,
        database_name: payload.database,
        // TODO: encrypt credentials before storing
        credentials: JSON.stringify({ username: payload.username, password: payload.password }),
        status: 'disconnected',
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  /** Instantiate & connect a connector for the given connectionId */
  async connect(connectionId: string, onEvent: (e: any) => void): Promise<void> {
    const { data, error } = await this.supabase
      .from('db_connections')
      .select('*')
      .eq('id', connectionId)
      .single();
    if (error || !data) throw new NotFoundException(`Connection ${connectionId} not found`);

    const creds = JSON.parse(data.credentials ?? '{}');
    const config: ConnectionConfig = {
      id: data.id,
      name: data.name,
      engine: data.engine,
      host: data.host,
      port: data.port,
      database: data.database_name,
      username: creds.username,
      password: creds.password,
    };

    const connector: IConnector =
      config.engine === 'postgres'
        ? new PostgresConnector(config)
        : new MySQLConnector(config);

    await connector.connect();
    await connector.startListening(onEvent);
    this.activeConnectors.set(connectionId, connector);

    await this.supabase
      .from('db_connections')
      .update({ status: 'connected' })
      .eq('id', connectionId);

    this.logger.log(`Connector active for ${connectionId} (${config.engine})`);
  }

  /** Disconnect and remove a connector */
  async disconnect(connectionId: string): Promise<void> {
    const connector = this.activeConnectors.get(connectionId);
    if (!connector) return;
    await connector.stopListening();
    await connector.disconnect();
    this.activeConnectors.delete(connectionId);
    await this.supabase
      .from('db_connections')
      .update({ status: 'disconnected' })
      .eq('id', connectionId);
    this.logger.log(`Connector removed for ${connectionId}`);
  }

  getActiveConnector(connectionId: string): IConnector | undefined {
    return this.activeConnectors.get(connectionId);
  }
}
