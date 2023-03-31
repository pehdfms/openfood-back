import { PaginationQuery, PaginationResponse } from '@libs/types/pagination'
import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Product } from './entities/product.entity'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: EntityRepository<Product>
  ) {}

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
