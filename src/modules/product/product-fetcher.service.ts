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

  async getFilesRemaining(): Promise<FetchStatus[]> {
    const indexUrl = 'https://challenges.coode.sh/food/data/json/index.txt'
    const response = await this.httpService.get<string>(indexUrl).toPromise()

    const fetchStatuses = await this.fetchStatusRepository.findAll()

    const unindexedFiles = response.data.split('\n').filter((filename) => {
      return !fetchStatuses.some((fetchStatus) => fetchStatus.filename === filename)
    })

    this.logger.verbose(`Found ${unindexedFiles.length - 1} unindexed files`)

    unindexedFiles.forEach(async (filename) => {
      if (filename === '') {
        return
      }

      const newFile = this.fetchStatusRepository.create({
        filename,
        cursor: 0,
        done: false,
        downloaded: false
      })

      await this.fetchStatusRepository.persistAndFlush(newFile)
    })

    return await this.fetchStatusRepository.findAll({
      having: { done: false },
      groupBy: 'filename'
    })
  }

  async fileToDownload(): Promise<FetchStatus | null> {
    const filesRemaining = (await this.getFilesRemaining()).sort((a, b) =>
      // This sorts files from newest to oldest, if you need oldest to newest,
      // replace a.filename with b.filename and vice-versa
      a.filename.localeCompare(b.filename)
    )

    if (filesRemaining.length === 0) {
      return null
    }

    this.logger.verbose(`Found ${filesRemaining.length} files left to download`)

    const nextFile = filesRemaining.reduce((prev, curr) => {
      return prev.cursor > curr.cursor ? prev : curr
    })

    return nextFile
  }

  async downloadProducts(filename: string, path: string) {
    this.logger.verbose(`Downloading ${filename}...`)

    const response = await this.httpService
      .get(`https://challenges.coode.sh/food/data/json/${filename}`, {
        responseType: 'arraybuffer'
      })
      .toPromise()

    this.logger.verbose(`Uncompressing ${filename}...`)
    const uncompressed = gunzipSync(response.data)

    this.logger.verbose(`Writing to file...`)
    writeFileSync(path, uncompressed)
  }

  readProducts(path: string, count: number, cursor: number): Product[] {
    const fileContents = readFileSync(path, 'utf8')
    const lines = fileContents.split('\n').filter((line) => line !== '')

    const products = []
    for (let i = cursor; i < cursor + count && i < lines.length; i++) {
      try {
        const json = JSON.parse(lines[i])

        const product: Product = {
          code: json.code,
          status: ProductStatus.Draft,
          created_t: parseInt(json.created_t, 10),
          last_modified_t: parseInt(json.last_modified_t, 10),
          imported_t: new Date(),
          url: json.url,
          creator: json.creator,
          product_name: json.product_name,
          quantity: json.quantity,
          brands: json.brands,
          categories: json.categories,
          labels: json.labels,
          cities: json.cities,
          purchase_places: json.purchase_places,
          stores: json.stores,
          ingredients_text: json.ingredients_text,
          traces: json.traces,
          serving_size: json.serving_size,
          serving_quantity: json.serving_quantity,
          nutriscore_score: json.nutriscore_score,
          nutriscore_grade: json.nutriscore_grade,
          main_category: json.main_category,
          image_url: json.image_url
        }

        products.push(this.productRepository.create(product))
      } catch (err) {
        this.logger.error(`Error parsing line ${i} of ${path}: ${err}`)
      }
    }

    return products
  }

  async saveProducts(fromFile: FetchStatus, count: number): Promise<number> {
    const filePath = path.join(__dirname, fromFile.filename)
    const isDownloaded = fromFile.downloaded && existsSync(filePath)

    if (!isDownloaded) {
      await this.downloadProducts(fromFile.filename, filePath)

      wrap(fromFile).assign({ downloaded: true })
      await this.fetchStatusRepository.persistAndFlush(fromFile)
    }

    const products = this.readProducts(filePath, count, fromFile.cursor)
    await this.productRepository.persistAndFlush(products)

    wrap(fromFile).assign({
      cursor: fromFile.cursor + products.length,
      done: products.length < count
    })
    await this.fetchStatusRepository.persistAndFlush(fromFile)

    return products.length
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  @UseRequestContext()
  async fetch() {
    this.logger.log('Synchronizing with product list...')

    const expectedDownloadCount = 1
    let downloadCount = 0

    while (downloadCount !== expectedDownloadCount) {
      const fileToDownload = await this.fileToDownload()

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
  }
}
