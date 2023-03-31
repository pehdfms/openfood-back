import { PaginationQuery, PaginationResponse } from '@libs/types/pagination'
import { getPaginationOptions } from '@libs/utils/pagination.utils'
import { EntityRepository } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable, NotFoundException } from '@nestjs/common'
import { UpdateProductDto } from './dto/update-product.dto'
import { Product } from './entities/product.entity'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: EntityRepository<Product>
  ) {}

  async findAll(query: PaginationQuery): Promise<PaginationResponse<Product>> {
    const [result, total] = await this.productRepository.findAndCount(
      {},
      getPaginationOptions(query)
    )

    return new PaginationResponse(query, total, result)
  }

  async findOne(code: string): Promise<Product> {
    const result = await this.productRepository.findOne({ code })

    if (!result) {
      throw new NotFoundException()
    }

    return result
  }

  async update(code: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.findOne(code)
    this.productRepository.assign(existingProduct, updateProductDto)

    await this.productRepository.persistAndFlush(existingProduct)
    return existingProduct
  }

  remove(id: number) {
    return `This action removes a #${id} product`
  }
}
