import { Injectable } from '@nestjs/common'

export type HealthCheckResults = {
  dbStatus: string
  lastCronRun: Date
  uptime: number
  memoryUsage: string
}

@Injectable()
export class AppService {
  healthCheck(): HealthCheckResults {
    // TODO switch dbStatus, lastCronRun, uptime, and memoryUsage to use real data
    return { dbStatus: 'ok', lastCronRun: new Date(), uptime: 10000, memoryUsage: '100MB' }
  }
}
