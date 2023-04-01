import { FetchHistory } from '@modules/sync/entities/fetch-history.entity'
import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

export type HealthCheckResults = {
  dbStatus: string
  lastCronRun?: FetchHistory
  uptime: number
  memoryUsage: string
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async healthCheck(): Promise<HealthCheckResults> {
    return {
      dbStatus: await this.appService.dbStatus(),
      lastCronRun: await this.appService.lastCronRun(),
      uptime: this.appService.uptime(),
      memoryUsage: this.appService.memoryUsage()
    }
  }
}
