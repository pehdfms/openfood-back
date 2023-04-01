import { EntityRepository, MikroORM, UseRequestContext, wrap } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { FetchStatus } from './entities/fetch-status.entity'
import { Product, ProductStatus } from './entities/product.entity'
import { HttpService } from '@nestjs/axios'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { gunzipSync } from 'zlib'
import path from 'path'

@Injectable()
export class ProductFetcherService {
  private readonly logger = new Logger(ProductFetcherService.name)

  constructor(
    @InjectRepository(Product) private readonly productRepository: EntityRepository<Product>,
    @InjectRepository(FetchStatus)
    private readonly fetchStatusRepository: EntityRepository<FetchStatus>,
    private readonly httpService: HttpService,
    private readonly orm: MikroORM
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async fetch() {
    this.logger.log('hello!')
  }
}
