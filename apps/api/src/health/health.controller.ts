import { Controller, Get, Param } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  /** GET /api/health — full system health snapshot */
  @Get()
  system() {
    return this.health.getSystemHealth();
  }

  /** GET /api/health/connections/:id — single connection ping */
  @Get('connections/:id')
  connection(@Param('id') id: string) {
    return this.health.checkConnection(id);
  }
}
