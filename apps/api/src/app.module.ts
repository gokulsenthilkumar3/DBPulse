import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConnectorsModule } from './connectors/connectors.module';
import { EventsModule } from './events/events.module';
import { StreamModule } from './stream/stream.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ConnectorsModule,
    EventsModule,
    StreamModule,
  ],
})
export class AppModule {}
