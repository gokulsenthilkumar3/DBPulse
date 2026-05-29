import { Controller, Get, Query } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Get()
  query(
    @Query('connectionId') connectionId?: string,
    @Query('tableName') tableName?: string,
    @Query('actor') actor?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.events.queryEvents({
      connectionId,
      tableName,
      actor,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }
}
