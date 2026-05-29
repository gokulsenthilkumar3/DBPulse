import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AuditEvent } from '@dbpulse/shared';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/stream' })
export class StreamGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger(StreamGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /** Subscribe a client to a specific connection's event stream */
  @SubscribeMessage('subscribe')
  handleSubscribe(@MessageBody() connectionId: string) {
    return { event: 'subscribed', data: { connectionId } };
  }

  /** Broadcast a new AuditEvent to all connected WebSocket clients */
  broadcast(event: AuditEvent): void {
    this.server.emit('audit_event', event);
    this.logger.debug(`Broadcast: ${event.operation} on ${event.tableName} by ${event.actor}`);
  }
}
