import { Controller, Post, Query } from '@nestjs/common'
import { ApiCreatedResponse, ApiOperation, ApiPropertyOptional, ApiTags } from '@nestjs/swagger'
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
@ApiTags('Sync')
export class SyncController {
  constructor(private readonly productFetcherService: ProductFetcherService) {}

  @Post()
  @ApiOperation({
    description: 'Synchronizes database with upstream index',
    summary: 'Synchronize DB with index'
  })
  @ApiCreatedResponse({
    description: 'Synchronization ran succesfully',
    schema: { example: 'Downloaded 100 products while synchronizing' }
  })
  async sync(@Query() query: SyncQueryParams): Promise<string> {
    const downloadCount = await this.productFetcherService.fetch(query.count)
    return `Downloaded ${downloadCount} product${downloadCount > 1 ? 's' : ''} while synchronizing`
  }
}
