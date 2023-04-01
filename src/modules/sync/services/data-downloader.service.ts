import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { gunzipSync } from 'zlib'
import { FileIOService } from './file-io.service'
import { FetchStatus } from '../entities/fetch-status.entity'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository, wrap } from '@mikro-orm/core'

@Injectable()
export class DataDownloader {
  private readonly logger = new Logger(DataDownloader.name)

  constructor(
    @InjectRepository(FetchStatus)
    private readonly fetchStatusRepository: EntityRepository<FetchStatus>,
    private readonly httpService: HttpService,
    private readonly fileIOService: FileIOService
  ) {}

  async index(url: string, ignore?: string[]): Promise<FetchStatus[]> {
    this.logger.verbose(`Indexing ${url}`)

    const response = await this.httpService.get<string>(url).toPromise()
    let files = response.data.split('\n').filter((filename) => filename !== '')

    if (ignore) {
      files = files.filter((filename) => !ignore.some((ignoredFile) => ignoredFile === filename))
    }

    this.logger.verbose(`Found ${files.length} files while indexing ${url}`)
    this.logger.verbose(`Persisting indexing information to database`)

    files.forEach(async (filename) => {
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

  async indexRemaining(url: string): Promise<FetchStatus[]> {
    const ignoreFiles = (await this.fetchStatusRepository.findAll()).map(
      (fetchStatus) => fetchStatus.filename
    )

    return await this.index(url, ignoreFiles)
  }

  async nextToDownload(indexUrl: string): Promise<FetchStatus | null> {
    const filesRemaining = (await this.indexRemaining(indexUrl)).sort((a, b) =>
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

  async updateCursor(fetchStatus: FetchStatus, expectedCount: number, actualCount: number) {
    wrap(fetchStatus).assign({
      cursor: fetchStatus.cursor + actualCount,
      done: actualCount < expectedCount
    })

    await this.fetchStatusRepository.persistAndFlush(fetchStatus)
  }

  async downloadGz(url: string, path: string, statusToUpdate?: FetchStatus) {
    this.logger.verbose(`Downloading file at ${url} to ${path}`)

    const response = await this.httpService
      .get(url, {
        responseType: 'arraybuffer'
      })
      .toPromise()

    this.logger.verbose(`Uncompressing file downloaded from ${url}...`)
    const uncompressed = gunzipSync(response.data)

    this.logger.verbose(`Writing file downloaded from ${url} to ${path}...`)
    this.fileIOService.writeBuffer(path, uncompressed)

    this.logger.verbose(`Done writing file downloaded from ${url} to ${path}`)

    if (statusToUpdate) {
      wrap(statusToUpdate).assign({ downloaded: true })
      await this.fetchStatusRepository.persistAndFlush(statusToUpdate)
    }
  }
}
