import { Controller, Post, Query } from '@nestjs/common'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, Min } from 'class-validator'
import { ProductFetcherService } from './services/product-fetcher.service'

class SyncQueryParams {
  @ApiPropertyOptional({ default: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  count?: number
}

@Controller('sync')
export class SyncController {
  constructor(private readonly productFetcherService: ProductFetcherService) {}

  @Post()
  async sync(@Query() query: SyncQueryParams): Promise<string> {
    const downloadCount = await this.productFetcherService.fetch(query.count)
    return `Downloaded ${downloadCount} product${downloadCount > 1 ? 's' : ''} while synchronizing`
  }
}
