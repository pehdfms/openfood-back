import { EntityRepository, MikroORM, UseRequestContext } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import path from 'path'
import { Product, ProductStatus } from '@modules/product/entities/product.entity'
import { FetchStatus } from '../entities/fetch-status.entity'
import { DataDownloader } from './data-downloader.service'
import { FileIOService, UnknownObject } from './file-io.service'
import { FetchHistory } from '../entities/fetch-history.entity'
import { plainToInstance } from 'class-transformer'

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

  objectProductMapper(obj: UnknownObject): Product | null {
    if (typeof obj.created_t !== 'string' || typeof obj.last_modified_t !== 'string') {
      return null
    }

    obj.status = ProductStatus.Draft
    obj.created_t = parseInt(obj.created_t, 10)
    obj.last_modified_t = parseInt(obj.last_modified_t, 10)
    obj.imported_t = new Date()

    // FIXME plainToInstance doesn't fail if obj isn't a valid Product
    // this will fail anyways when saving to the database, but it's still not great
    const product = plainToInstance(Product, obj, { excludeExtraneousValues: true })
    return product
  }

  async saveProducts(fromFile: FetchStatus, count: number): Promise<number> {
    // TODO download to another folder
    const filePath = path.join(__dirname, fromFile.filename)
    const isDownloaded = fromFile.downloaded && this.fileIOService.fileExists(filePath)

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
  async fetch(expectedDownloadCount = 100): Promise<number> {
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
