import { PartialType } from '@nestjs/mapped-types'
import { CreateProductDto } from './create-product.dto'

// TODO write UpdateProductDTO
export class UpdateProductDto extends PartialType(CreateProductDto) {}
