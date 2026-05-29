import { Module } from '@nestjs/common';
import { ConnectorsService } from './connectors.service';
import { ConnectorsController } from './connectors.controller';

@Module({
  providers: [ConnectorsService],
  controllers: [ConnectorsController],
  exports: [ConnectorsService],
})
export class ConnectorsModule {}
