import { getRepositoryToken } from '@mikro-orm/nestjs'
import { HttpService } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { Mock, generateMockProducts, repositoryMockFactory } from 'test/mocks'
import { FetchStatus } from '../entities/fetch-status.entity'
import { DataDownloader } from './data-downloader.service'
import { FileIOService } from './file-io.service'

describe('DataDownloader', () => {
  type MockRepository = ReturnType<typeof repositoryMockFactory>

  let service: DataDownloader
  let fetchStatusRepository: MockRepository
  let httpService: Mock<HttpService>
  let fileIOService: Mock<FileIOService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataDownloader,
        { provide: getRepositoryToken(FetchStatus), useFactory: repositoryMockFactory },
        { provide: HttpService, useValue: { get: jest.fn() } },
        {
          provide: FileIOService,
          useValue: { readJsonFile: jest.fn() }
        }
      ]
    }).compile()

    service = module.get<DataDownloader>(DataDownloader)

    fetchStatusRepository = module.get(getRepositoryToken(FetchStatus))
    httpService = module.get(HttpService)
    fileIOService = module.get(FileIOService)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Indexing', () => {
    const products = generateMockProducts(25)
    let fromFile: FetchStatus

    const statusCollection: FetchStatus[] = [
      { filename: 'a.json', cursor: 0, done: false, downloaded: false },
      { filename: 'b.json', cursor: 0, done: false, downloaded: false },
      { filename: 'c.json', cursor: 0, done: false, downloaded: false },
      { filename: 'd.json', cursor: 0, done: false, downloaded: false },
      { filename: 'e.json', cursor: 0, done: false, downloaded: false },
      { filename: 'f.json', cursor: 0, done: false, downloaded: false },
      { filename: 'g.json', cursor: 0, done: false, downloaded: false }
    ]

    beforeEach(async () => {
      httpService.get.mockReturnValue({
        async toPromise() {
          const data = statusCollection.map((status) => status.filename).join('\n')
          return Promise.resolve({ data })
        }
      })
      fetchStatusRepository.findAll.mockResolvedValue(statusCollection)
    })

    describe('index', () => {
      it('should index filenames', async () => {
        await service.index('www.example.com')
        expect(fetchStatusRepository.persistAndFlush).toHaveBeenCalledWith(statusCollection)
      })

      it('should be able to ignore filenames', async () => {
        const ignoredFilenames = ['a.json', 'b.json']
        await service.index('www.example.com', ignoredFilenames)

        expect(fetchStatusRepository.persistAndFlush).toHaveBeenCalledWith(
          statusCollection.filter(
            (status) => !ignoredFilenames.some((ignoredFile) => ignoredFile === status.filename)
          )
        )
      })

      it('should return items to be downloaded', async () => {
        const result = await service.index('www.example.com')
        expect(result).toBe(statusCollection)
      })
    })

    describe('indexRemaining', () => {
      it('should ignore files already indexed', async () => {
        const ignoredFilenames = ['a.json', 'b.json']
        fetchStatusRepository.findAll.mockResolvedValueOnce(
          ignoredFilenames.map((filename) => ({
            filename
          }))
        )

        await service.indexRemaining('www.example.com')

        expect(fetchStatusRepository.persistAndFlush).toHaveBeenCalledWith(
          statusCollection.filter(
            (status) => !ignoredFilenames.some((ignoredFile) => ignoredFile === status.filename)
          )
        )
      })
    })
  })
})
