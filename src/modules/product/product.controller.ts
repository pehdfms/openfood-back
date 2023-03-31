import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Query,
  Put,
  HttpStatus,
  HttpCode
} from '@nestjs/common'
import { ProductService } from './product.service'
import { UpdateProductDto } from './dto/update-product.dto'
import { PaginationQuery, PaginationResponse } from '@libs/types/pagination'
import { Product } from './entities/product.entity'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(@Query() query: PaginationQuery): Promise<PaginationResponse<Product>> {
    return await this.productService.findAll(query)
  }

  @Get(':code')
  async findOne(@Param('code') code: string): Promise<Product> {
    return await this.productService.findOne(code)
  }

  @Put(':code')
  async update(
    @Param('code') code: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<Product> {
    return await this.productService.update(code, updateProductDto)
  }

  @Delete(':code')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('code') code: string): Promise<void> {
    await this.productService.remove(code)
  }
}
