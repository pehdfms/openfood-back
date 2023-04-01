import { Injectable, Logger } from '@nestjs/common'
import { createReadStream, existsSync, writeFileSync } from 'fs'
import readline from 'readline'

// TODO improve json arg type
type JsonMapper<T> = (json: any) => T

@Injectable()
export class FileIOService {
  private readonly logger = new Logger(FileIOService.name)

  constructor() {}

  fileExists(path: string): boolean {
    return existsSync(path)
  }

  async readJsonFile<T>(
    jsonMapper: JsonMapper<T>,
    path: string,
    startLine: number = 0,
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

    const objects = []
    let lineNumber = 0
    for await (const line of rl) {
      if (lineNumber >= startLine) {
        try {
          const json = JSON.parse(line)

          this.logger.log('mapping object...')
          const mappedObject = jsonMapper(json)

          objects.push(mappedObject)

          if (objects.length === lineCount) {
            rl.close()
            fileStream.close()
            return objects
          }
        } catch (err) {
          this.logger.error(`Error parsing line ${lineNumber} of ${path}: ${err}`)
        }
      }
      lineNumber++
    }

    return objects
  }

  writeBuffer(path: string, buffer: Buffer) {
    writeFileSync(path, buffer)
  }
}
