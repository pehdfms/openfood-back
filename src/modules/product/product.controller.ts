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
import { Product, ProductStatus } from './entities/product.entity'
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'

const exampleProduct: Product = {
  code: '8718215063506',
  status: ProductStatus.Draft,
  created_t: 1549186403,
  last_modified_t: 1549186405,
  imported_t: new Date(),
  url: 'http://world-en.openfoodfacts.org/product/8718215063506/sesamzaad-ongepeld',
  creator: 'kiliweb',
  product_name: 'Sesamzaad ongepeld',
  quantity: '',
  brands: '',
  categories: '',
  labels: '',
  cities: '',
  purchase_places: '',
  stores: '',
  ingredients_text: '',
  traces: '',
  serving_size: '',
  serving_quantity: '',
  nutriscore_score: '',
  nutriscore_grade: '',
  main_category: '',
  image_url: 'https://static.openfoodfacts.org/images/products/871/821/506/3506/front_fr.4.400.jpg'
}

@Controller('products')
@ApiTags('Products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({
    description: 'Returns all products with pagination set by query',
    summary: 'Find All Products'
  })
  @ApiOkResponse({
    description: 'Succesfully found products, returning a paginated list of products',
    schema: {
      example: {
        data: [exampleProduct],
        page: {
          perPage: 5,
          totalItems: 1,
          totalPages: 1,
          current: 0
        }
      }
    }
  })
  async findAll(@Query() query: PaginationQuery): Promise<PaginationResponse<Product>> {
    return await this.productService.findAll(query)
  }

  @ApiOperation({
    description: 'Find product with :code',
    summary: 'Find One Product'
  })
  @ApiOkResponse({
    description: 'Succesfully found product with :code',
    schema: { example: exampleProduct }
  })
  @ApiNotFoundResponse({
    description: 'Could not find product with :code'
  })
  @Get(':code')
  async findOne(@Param('code') code: string): Promise<Product> {
    return await this.productService.findOne(code)
  }

  @ApiOperation({
    description: 'Update product with :code by merging it with UpdateProductDto',
    summary: 'Update Product'
  })
  @ApiOkResponse({
    description: 'Succesfully updated product, returns product with received patches',
    schema: { example: exampleProduct }
  })
  @ApiBadRequestResponse({
    description: 'Received UpdateProductDto is not a valid patch object'
  })
  @ApiNotFoundResponse({
    description: 'Could not find product with :code'
  })
  @Put(':code')
  async update(
    @Param('code') code: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<Product> {
    return await this.productService.update(code, updateProductDto)
  }

  @ApiOperation({
    description: 'Sets product status to trash, removing it from findAll queries',
    summary: 'Soft Delete Product'
  })
  @ApiNoContentResponse({
    description: 'Succesfully soft deleted product'
  })
  @ApiNotFoundResponse({
    description: 'Could not find product with :code'
  })
  @Delete(':code')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('code') code: string): Promise<void> {
    await this.productService.remove(code)
  }
}
