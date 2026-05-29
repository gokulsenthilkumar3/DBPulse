import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ConnectorsService } from './connectors.service';
import { EventsService } from '../events/events.service';
import { StreamGateway } from '../stream/stream.gateway';
import { CreateConnectionDto } from './dto/create-connection.dto';

@Controller('connections')
export class ConnectorsController {
  constructor(
    private readonly connectors: ConnectorsService,
    private readonly events: EventsService,
    private readonly stream: StreamGateway,
  ) {}

  @Get()
  list() {
    return this.connectors.listConnections();
  }

  @Post()
  create(@Body() dto: CreateConnectionDto) {
    return this.connectors.createConnection(dto as any);
  }

  @Post(':id/connect')
  async connect(@Param('id') id: string) {
    await this.connectors.connect(id, async (event) => {
      const saved = await this.events.saveEvent(event);
      this.stream.broadcast(saved);
    });
    return { status: 'connected', connectionId: id };
  }

  @Delete(':id/connect')
  async disconnect(@Param('id') id: string) {
    await this.connectors.disconnect(id);
    return { status: 'disconnected', connectionId: id };
  }
}
