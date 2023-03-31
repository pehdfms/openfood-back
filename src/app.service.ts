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
    // TODO switch dbStatus, lastCronRun, and memoryUsage to use real data
    const uptime = process.uptime()
    return { dbStatus: 'ok', lastCronRun: new Date(), uptime, memoryUsage: '100MB' }
  }
}
