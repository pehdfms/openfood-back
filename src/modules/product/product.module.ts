import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Product } from './entities/product.entity'
import { ProductFetcherService } from './product-fetcher.service'
import { FetchStatus } from './entities/fetch-status.entity'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [MikroOrmModule.forFeature([Product, FetchStatus]), HttpModule],
  controllers: [ProductController],
  providers: [ProductService, ProductFetcherService]
})
export class ProductModule {}
