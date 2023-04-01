import { FetchHistory } from '@modules/sync/entities/fetch-history.entity'
import { Controller, Get } from '@nestjs/common'
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags
} from '@nestjs/swagger'
import { AppService } from './app.service'

export class HealthCheckResults {
  @ApiProperty({ example: 'up' })
  dbStatus: string

  @ApiPropertyOptional({
    example: {
      id: 7,
      run_t: '2023-04-01T17:40:05.000Z',
      fetch_count: 100
    },
    description: 'Last Cron Run data such as number of items fetched, index and run time'
  })
  lastCronRun?: FetchHistory

  @ApiProperty({ example: 125.31081 })
  uptime: number

  @ApiProperty({ example: '91.37 MB' })
  memoryUsage: string
}

@Controller()
@ApiTags('App')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    description:
      'Checks the health of the system by querying the database and providing information on uptime and memory usage.',
    summary: 'Health Check'
  })
  @ApiOkResponse({
    description: 'Health Check ran successfully',
    type: HealthCheckResults
  })
  async healthCheck(): Promise<HealthCheckResults> {
    return {
      dbStatus: await this.appService.dbStatus(),
      lastCronRun: await this.appService.lastCronRun(),
      uptime: this.appService.uptime(),
      memoryUsage: this.appService.memoryUsage()
    }
  }
}
