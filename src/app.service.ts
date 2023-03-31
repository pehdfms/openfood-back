import { Injectable } from '@nestjs/common'

export type HealthCheckResults = {
  dbStatus: string
  lastCronRun: Date
}

@Injectable()
export class AppService {
  healthCheck(): HealthCheckResults {
    // TODO switch dbStatus and lastCronRun to use real data
    return { dbStatus: 'ok', lastCronRun: new Date() }
  }
}
