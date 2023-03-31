import { Injectable } from '@nestjs/common'
import { HealthCheckService, MikroOrmHealthIndicator } from '@nestjs/terminus'
import { format } from 'util'

export type HealthCheckResults = {
  dbStatus: string
  lastCronRun: Date
  uptime: number
  memoryUsage: string
}

@Injectable()
export class AppService {
  constructor(private health: HealthCheckService, private db: MikroOrmHealthIndicator) {}

  async healthCheck(): Promise<HealthCheckResults> {
    // TODO switch lastCronRun to use real data
    const terminusHealth = await this.health.check([() => this.db.pingCheck('database')])
    const dbStatus = terminusHealth.details['database'].status

    const uptime = process.uptime()
    const memoryUsageInBytes = process.memoryUsage().heapUsed
    const memoryUsage = format('%s MB', (memoryUsageInBytes / 1024 / 1024).toFixed(2))

    return { dbStatus, lastCronRun: new Date(), uptime, memoryUsage }
  }
}
