import { PaginationQuery, PaginationResponse } from '@libs/types/pagination'
import { Injectable } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductService {
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product'
  }

  findAll(query: PaginationQuery): PaginationResponse<string> {
    const result = `This action returns all product`
    return new PaginationResponse(query, 1, [result])
  }

  findOne(id: number) {
    return `This action returns a #${id} product`
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`
  }

  remove(id: number) {
    return `This action removes a #${id} product`
  }
}
