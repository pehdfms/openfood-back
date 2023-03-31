import { Injectable } from '@nestjs/common'
import { format } from 'util'

export type HealthCheckResults = {
  dbStatus: string
  lastCronRun: Date
  uptime: number
  memoryUsage: string
}

@Injectable()
export class AppService {
  healthCheck(): HealthCheckResults {
    // TODO switch dbStatus and lastCronRun to use real data
    const uptime = process.uptime()
    const memoryUsageInBytes = process.memoryUsage().heapUsed
    const memoryUsage = format('%s MB', (memoryUsageInBytes / 1024 / 1024).toFixed(2))

    return { dbStatus: 'ok', lastCronRun: new Date(), uptime, memoryUsage }
  }
}
