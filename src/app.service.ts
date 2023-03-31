import { Injectable } from '@nestjs/common'

export type HealthCheckResults = {
  dbStatus: string
}

@Injectable()
export class AppService {
  healthCheck(): HealthCheckResults {
    return { dbStatus: 'ok' }
  }
}
