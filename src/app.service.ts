import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { FetchHistory } from '@modules/sync/entities/fetch-history.entity'
import { Injectable } from '@nestjs/common'
import { HealthCheckService, MikroOrmHealthIndicator } from '@nestjs/terminus'
import { format } from 'util'

@Injectable()
export class AppService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: MikroOrmHealthIndicator,
    @InjectRepository(FetchHistory)
    private readonly fetchHistoryRepository: EntityRepository<FetchHistory>
  ) {}

  async dbStatus(): Promise<string> {
    const terminusHealth = await this.health.check([() => this.db.pingCheck('database')])
    return terminusHealth.details['database'].status
  }

  async lastCronRun(): Promise<FetchHistory> {
    const lastCronRun = (
      await this.fetchHistoryRepository.findAll({
        orderBy: { run_t: 'desc' },
        limit: 1
      })
    )[0]

    return lastCronRun || null
  }

  uptime(): number {
    return process.uptime()
  }

  memoryUsage(): string {
    const memoryUsageInBytes = process.memoryUsage().heapUsed
    const memoryUsage = format('%s MB', (memoryUsageInBytes / 1024 / 1024).toFixed(2))

    return memoryUsage
  }
}
