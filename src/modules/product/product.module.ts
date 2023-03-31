import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Product } from './entities/product.entity'
import { ProductFetcherService } from './product-fetcher.service'

@Module({
  imports: [MikroOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, ProductFetcherService]
})
export class ProductModule {}
