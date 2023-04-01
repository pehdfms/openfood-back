import { EntityRepository, MikroORM, UseRequestContext, wrap } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { existsSync } from 'fs'
import path from 'path'
import { Product, ProductStatus } from '@modules/product/entities/product.entity'
import { FetchStatus } from '../entities/fetch-status.entity'
import { DataDownloader } from './data-downloader.service'
import { FileIOService } from './file-io.service'
import { FetchHistory } from '../entities/fetch-history.entity'

@Injectable()
export class ProductFetcherService {
  private readonly logger = new Logger(ProductFetcherService.name)

  constructor(
    @InjectRepository(Product) private readonly productRepository: EntityRepository<Product>,
    @InjectRepository(FetchHistory)
    private readonly fetchHistoryRepository: EntityRepository<FetchHistory>,
    private readonly dataDownloader: DataDownloader,
    private readonly fileIOService: FileIOService,
    private readonly orm: MikroORM
  ) {}

  objectProductMapper(obj: any): Product {
    // TODO I don't want to import lodash just to simplify this
    const product: Product = {
      code: obj.code,
      status: ProductStatus.Draft,
      created_t: parseInt(obj.created_t, 10),
      last_modified_t: parseInt(obj.last_modified_t, 10),
      imported_t: new Date(),
      url: obj.url,
      creator: obj.creator,
      product_name: obj.product_name,
      quantity: obj.quantity,
      brands: obj.brands,
      categories: obj.categories,
      labels: obj.labels,
      cities: obj.cities,
      purchase_places: obj.purchase_places,
      stores: obj.stores,
      ingredients_text: obj.ingredients_text,
      traces: obj.traces,
      serving_size: obj.serving_size,
      serving_quantity: obj.serving_quantity,
      nutriscore_score: obj.nutriscore_score,
      nutriscore_grade: obj.nutriscore_grade,
      main_category: obj.main_category,
      image_url: obj.image_url
    }

    return product
  }

  async saveProducts(fromFile: FetchStatus, count: number): Promise<number> {
    // TODO download to another folder
    const filePath = path.join(__dirname, fromFile.filename)
    const isDownloaded = fromFile.downloaded && existsSync(filePath)

    if (!isDownloaded) {
      await this.dataDownloader.downloadGz(
        `https://challenges.coode.sh/food/data/json/${fromFile.filename}`,
        filePath,
        fromFile
      )
    }

    const products = (
      await this.fileIOService.readJsonFile(
        this.objectProductMapper,
        filePath,
        fromFile.cursor,
        count
      )
    ).map((product) => this.productRepository.create(product))

    await this.productRepository.persistAndFlush(products)
    await this.dataDownloader.updateCursor(fromFile, count, products.length)

    return products.length
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @UseRequestContext()
  async fetch(expectedDownloadCount: number = 100): Promise<number> {
    this.logger.log('Synchronizing with product list...')

    let downloadCount = 0

    while (downloadCount !== expectedDownloadCount) {
      const fileToDownload = await this.dataDownloader.nextToDownload(
        'https://challenges.coode.sh/food/data/json/index.txt'
      )

      if (!fileToDownload) {
        this.logger.verbose('No more products left to download!')
        break
      }

      downloadCount += await this.saveProducts(
        fileToDownload,
        expectedDownloadCount - downloadCount
      )

      this.logger.verbose(`Downloaded ${downloadCount} products from ${fileToDownload.filename}`)
    }

    this.logger.log(`Finished synchronization, downloaded ${downloadCount} products`)

    const historyEntry = this.fetchHistoryRepository.create({ fetch_count: downloadCount })
    await this.fetchHistoryRepository.persistAndFlush(historyEntry)

    return downloadCount
  }
}
