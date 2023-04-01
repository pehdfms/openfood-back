import { Controller, Post } from '@nestjs/common'
import { ProductFetcherService } from './services/product-fetcher.service'

@Controller('sync')
export class SyncController {
  constructor(private readonly productFetcherService: ProductFetcherService) {}

  // TODO take item count as a parameter
  @Post()
  async sync(): Promise<string> {
    const downloadCount = await this.productFetcherService.fetch()
    return `Downloaded ${downloadCount} files while synchronizing`
  }
}
