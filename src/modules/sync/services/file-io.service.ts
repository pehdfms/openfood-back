import { Injectable, Logger } from '@nestjs/common'
import { createReadStream, existsSync, writeFileSync } from 'fs'
import readline from 'readline'

export type UnknownObject = Record<string, unknown>
type JsonMapper<T> = (json: UnknownObject) => T | null

@Injectable()
export class FileIOService {
  private readonly logger = new Logger(FileIOService.name)

  fileExists(path: string): boolean {
    return existsSync(path)
  }

  async readJsonFile<T>(
    jsonMapper: JsonMapper<T>,
    path: string,
    startLine = 0,
    lineCount?: number
  ): Promise<T[]> {
    if (!this.fileExists(path)) {
      throw new Error('Tried to read ${path}, but file was not found')
    }

    const fileStream = createReadStream(path, { encoding: 'utf8' })
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    })

    const lineCounter = (
      (i = 0) =>
      () =>
        i++
    )()

    const objects = []
    for await (const line of rl) {
      const lineNumber = lineCounter()

      if (lineNumber < startLine) {
        continue
      }

      try {
        const json = JSON.parse(line)

        const mappedObject = jsonMapper(json)

        if (mappedObject) {
          objects.push(mappedObject)
        }

        if (objects.length >= lineCount) {
          rl.close()
          fileStream.close()
          return objects
        }
      } catch (err) {
        this.logger.error(`Error parsing line ${lineNumber} of ${path}: ${err}`)
      }
    }

    return objects
  }

  writeBuffer(path: string, buffer: Buffer) {
    writeFileSync(path, buffer)
  }
}
