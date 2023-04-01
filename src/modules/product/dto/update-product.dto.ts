import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsUrl, MaxLength } from 'class-validator'
import { ProductStatus } from '../entities/product.entity'

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'draft' })
  @IsEnum()
  @IsOptional()
  status?: ProductStatus

  @ApiPropertyOptional({
    example:
      'http://world-en.openfoodfacts.org/product/0073490180262/absolutely-macaroons-toasted-coconut-royal-wine-corporation'
  })
  @MaxLength(1024)
  @IsUrl()
  @IsOptional()
  url?: string

  @ApiPropertyOptional({ example: 'usda-ndb-import' })
  @MaxLength(256)
  @IsOptional()
  creator?: string

  @ApiPropertyOptional({ example: 'Absolutely, Macaroons Toasted Coconut' })
  @MaxLength(256)
  @IsOptional()
  product_name?: string

  @ApiPropertyOptional({ example: '500g' })
  @MaxLength(256)
  @IsOptional()
  quantity?: string

  @ApiPropertyOptional({ example: 'Royal Wine Corporation' })
  @MaxLength(2048)
  @IsOptional()
  brands?: string

  @ApiPropertyOptional({
    example: 'Snacks, Sweet snacks, Biscuits and cakes, Biscuits, Pastries, Coconut Macaroons'
  })
  @MaxLength(1024)
  @IsOptional()
  categories?: string

  @ApiPropertyOptional({ example: 'en:palm-oil-free' })
  @MaxLength(2048)
  @IsOptional()
  labels?: string

  @ApiPropertyOptional({ example: 'New York' })
  @MaxLength(4096)
  @IsOptional()
  cities?: string

  @ApiPropertyOptional({ example: 'Roissy,France' })
  @MaxLength(8192)
  @IsOptional()
  purchase_places?: string

  @ApiPropertyOptional({ example: 'Marks & Spencer' })
  @MaxLength(4096)
  @IsOptional()
  stores?: string

  @ApiPropertyOptional({
    example: 'Sulfite free coconut, invert sugar, tapioca, cocoa, egg white.'
  })
  @MaxLength(8192)
  @IsOptional()
  ingredients_text?: string

  @ApiPropertyOptional({ example: 'en:eggs,en:milk' })
  @MaxLength(2048)
  @IsOptional()
  traces?: string

  @ApiPropertyOptional({ example: '2 MACAROONS (28 g)' })
  @MaxLength(256)
  @IsOptional()
  serving_size?: string

  @ApiPropertyOptional({ example: '28' })
  @MaxLength(256)
  @IsOptional()
  serving_quantity?: string

  @ApiPropertyOptional({ example: '21' })
  @MaxLength(256)
  @IsOptional()
  nutriscore_score?: string

  @ApiPropertyOptional({ example: 'e' })
  @MaxLength(256)
  @IsOptional()
  nutriscore_grade?: string

  @ApiPropertyOptional({ example: 'en:coconut-macaroons' })
  @MaxLength(256)
  @IsOptional()
  main_category?: string

  @ApiPropertyOptional({
    example: 'https://static.openfoodfacts.org/images/products/871/821/506/3506/front_fr.4.400.jpg'
  })
  @MaxLength(512)
  @IsUrl()
  @IsOptional()
  image_url?: string
}
