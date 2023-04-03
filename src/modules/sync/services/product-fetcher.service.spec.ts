import { MikroORM } from '@mikro-orm/core'
import { getRepositoryToken } from '@mikro-orm/nestjs'
import { Product } from '@modules/product/entities/product.entity'
import { Test, TestingModule } from '@nestjs/testing'
import { Mock, generateMockProducts, repositoryMockFactory } from 'test/mocks'
import { FetchHistory } from '../entities/fetch-history.entity'
import { FetchStatus } from '../entities/fetch-status.entity'
import { DataDownloader } from './data-downloader.service'
import { FileIOService } from './file-io.service'
import { ProductFetcherService } from './product-fetcher.service'

describe('ProductFetcherService', () => {
  type MockRepository = ReturnType<typeof repositoryMockFactory>

  let service: ProductFetcherService
  let productRepository: MockRepository
  let fetchHistoryRepository: MockRepository
  let dataDownloader: Mock<DataDownloader>
  let fileIOService: Mock<FileIOService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductFetcherService,
        { provide: getRepositoryToken(Product), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(FetchHistory), useFactory: repositoryMockFactory },
        {
          provide: DataDownloader,
          useValue: { downloadGz: jest.fn(), updateCursor: jest.fn(), nextToDownload: jest.fn() }
        },
        {
          provide: FileIOService,
          useValue: { readJsonFile: jest.fn() }
        },
        { provide: MikroORM, useValue: {} }
      ]
    }).compile()

    service = module.get<ProductFetcherService>(ProductFetcherService)

    productRepository = module.get(getRepositoryToken(Product))
    fetchHistoryRepository = module.get(getRepositoryToken(FetchHistory))
    dataDownloader = module.get(DataDownloader)
    fileIOService = module.get(FileIOService)
  })

  describe('saveProducts', () => {
    const products = generateMockProducts(25)
    let fromFile: FetchStatus

    beforeEach(async () => {
      fromFile = { filename: 'file.json', cursor: 0, done: false, downloaded: false }
      fileIOService.readJsonFile.mockImplementation(
        async (_: any, __: any, cursor: number, count: number) => {
          return products.slice(cursor, cursor + count)
        }
      )

      await service.saveProducts(fromFile, 5)
    })

    it('should skip downloading if we are done with the file', async () => {
      fromFile.done = true
      const result = await service.saveProducts(fromFile, 5)

      expect(result).toBe(0)
    })

    it('should download file if not yet saved', async () => {
      expect(dataDownloader.downloadGz).toHaveBeenCalledTimes(1)
    })

    it('should persist products', async () => {
      expect(productRepository.persistAndFlush).toHaveBeenCalledWith(products.slice(0, 5))
    })

    it('should update cursor', async () => {
      expect(dataDownloader.updateCursor).toHaveBeenCalledWith(fromFile, 5, 5)
    })
  })

  describe('fetch', () => {
    const products = generateMockProducts(25)

    beforeEach(() => {
      const fromFile: FetchStatus = {
        filename: 'file.json',
        cursor: 0,
        done: false,
        downloaded: false
      }

      dataDownloader.nextToDownload.mockResolvedValue(fromFile)
      fileIOService.readJsonFile.mockImplementation(
        async (_: any, __: any, cursor: number, count: number) => {
          return products.slice(cursor, cursor + count)
        }
      )
    })

    it('should update fetch history', async () => {
      await service.fetch(5)
      expect(fetchHistoryRepository.create).toHaveBeenCalledWith({ fetch_count: 5 })
      expect(fetchHistoryRepository.persistAndFlush).toHaveBeenCalledTimes(1)
    })

    it('should try again if a file is exhausted', async () => {
      fileIOService.readJsonFile.mockResolvedValueOnce(products.slice(0, 2))

      await service.fetch(5)
      expect(productRepository.persistAndFlush).toHaveBeenCalledTimes(2)
    })

    it('should stop fetching when there are no more files to download', async () => {
      dataDownloader.nextToDownload.mockResolvedValue(null)

      const result = await service.fetch(5)
      expect(result).toBe(0)
    })
  })
})
