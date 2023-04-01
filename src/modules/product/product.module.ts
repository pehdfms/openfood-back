import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Product } from './entities/product.entity'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [MikroOrmModule.forFeature([Product]), HttpModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
