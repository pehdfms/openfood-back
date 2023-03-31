import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common'
import { ProductService } from './product.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PaginationQuery, PaginationResponse } from '@libs/types/pagination'
import { Product } from './entities/product.entity'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto)
  }

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
  remove(@Param('code') code: string) {
    return this.productService.remove(+code)
  }
}
