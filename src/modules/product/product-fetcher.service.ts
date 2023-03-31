import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Product } from './entities/product.entity'

@Injectable()
export class ProductFetcherService {
  private readonly logger = new Logger(ProductFetcherService.name)

  constructor(
    @InjectRepository(Product) private readonly productRepository: EntityRepository<Product>
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async fetch() {
    this.logger.log('hello!')
  }
}
