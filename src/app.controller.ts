import { Controller, Get } from '@nestjs/common'
import { AppService, HealthCheckResults } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async healthCheck(): Promise<HealthCheckResults> {
    return await this.appService.healthCheck()
  }
}
