import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Product } from '@modules/product/entities/product.entity'
import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { FetchHistory } from './entities/fetch-history.entity'
import { FetchStatus } from './entities/fetch-status.entity'
import { DataDownloader } from './services/data-downloader.service'
import { FileIOService } from './services/file-io.service'
import { ProductFetcherService } from './services/product-fetcher.service'
import { SyncController } from './sync.controller'

// TODO consider importing ProductService instead of the repository directly
// we only need it to persist new products
@Module({
  imports: [MikroOrmModule.forFeature([Product, FetchStatus, FetchHistory]), HttpModule],
  controllers: [SyncController],
  providers: [ProductFetcherService, DataDownloader, FileIOService]
})
export class SyncModule {}
