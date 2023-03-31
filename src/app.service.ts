import { Injectable } from '@nestjs/common'

export type HealthCheckResults = {
  dbStatus: string
  lastCronRun: Date
  uptime: number
}

@Injectable()
export class AppService {
  healthCheck(): HealthCheckResults {
    // TODO switch dbStatus, lastCronRun, and uptime to use real data
    return { dbStatus: 'ok', lastCronRun: new Date(), uptime: 10000 }
  }
}
