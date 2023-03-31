import { Injectable } from '@nestjs/common'
import { HealthCheckService, MikroOrmHealthIndicator } from '@nestjs/terminus'
import { format } from 'util'

@Injectable()
export class AppService {
  constructor(private health: HealthCheckService, private db: MikroOrmHealthIndicator) {}

  async dbStatus(): Promise<string> {
    const terminusHealth = await this.health.check([() => this.db.pingCheck('database')])
    return terminusHealth.details['database'].status
  }

  lastCronRun(): Date {
    // TODO switch lastCronRun to use real data
    return new Date()
  }

  uptime(): number {
    return process.uptime()
  }

  memoryUsage(): string {
    const memoryUsageInBytes = process.memoryUsage().heapUsed
    const memoryUsage = format('%s MB', (memoryUsageInBytes / 1024 / 1024).toFixed(2))

    return memoryUsage
  }
}
