import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import request, { SuperAgentTest } from 'supertest'
import { setupFixture } from './utils'
import { ProductModule } from '@modules/product/product.module'
import { PaginationResponse } from '@libs/types/pagination'
import { getRepositoryToken, MikroOrmModule } from '@mikro-orm/nestjs'
import { Product } from '@modules/product/entities/product.entity'
import { generateMockProducts, repositoryMockFactory } from './mocks'

describe('Product Module (e2e)', () => {
  let app: INestApplication
  let agent: SuperAgentTest
  let server: any
  let repositoryMock: ReturnType<typeof repositoryMockFactory>

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductModule, MikroOrmModule.forRoot()]
    })
      .overrideProvider(getRepositoryToken(Product))
      .useFactory({ factory: repositoryMockFactory })
      .compile()

    app = moduleFixture.createNestApplication()
    setupFixture(app)

    await app.init()

    repositoryMock = moduleFixture.get(getRepositoryToken(Product))

    server = app.getHttpServer()
    agent = request.agent(server)
  })

  afterEach(async () => {
    await app.close()
    server.close()
  })

  const mockProducts = generateMockProducts(100)
  const expectedProduct = mockProducts[0]
  const expectedProductDto = {
    ...expectedProduct,
    imported_t: expectedProduct.imported_t.toISOString()
  }

  describe('GET /products', () => {
    const expectedProducts = mockProducts.map((product) => ({
      ...product,
      imported_t: product.imported_t.toISOString()
    }))
    let products: PaginationResponse<Product>
    const perPage = 5

    it('should exist', async () => {
      repositoryMock.findAndCount.mockImplementation(
        (_: any, pagination: { limit: number; offset: number }) => {
          const data = expectedProducts.slice(
            pagination.offset,
            pagination.offset + pagination.limit
          )

          return [data, expectedProducts.length]
        }
      )
      products = (await agent.get(`/products?perPage=${perPage}`).expect(HttpStatus.OK)).body
    })

    describe('Pagination', () => {
      it('should be paginated', () => {
        expect(products).toHaveProperty('data')
        expect(products).toHaveProperty('page')

        const { page } = products

        expect(page).toHaveProperty('perPage')
        expect(page).toHaveProperty('totalItems')
        expect(page).toHaveProperty('totalPages')
        expect(page).toHaveProperty('current')

        if (expectedProducts.length > perPage) {
          expect(page.totalPages).toBeGreaterThan(1)
          expect(products.data.length).toBe(expectedProducts.slice(0, perPage).length)
        } else {
          expect(products.data.length).toBe(expectedProducts.length)
        }
      })

      it('should match results', () => {
        const { data, page } = products

        expect(page.perPage).toBe(perPage)
        expect(page.perPage).toBeGreaterThanOrEqual(data.length)
        expect(page.totalItems).toBeGreaterThanOrEqual(data.length)
        expect(page.totalPages).toBeGreaterThanOrEqual(page.current)
      })
    })

    describe('Data', () => {
      it('should match expected data', () => {
        if (expectedProducts.length > perPage) {
          expect(products.data).toMatchObject(expectedProducts.slice(0, perPage))
        } else {
          expect(products.data).toMatchObject(expectedProducts)
        }
      })
    })
  })

  describe('GET /products/:code', () => {
    let product: Product

    it('should exist', async () => {
      repositoryMock.findOne.mockReturnValue(expectedProduct)
      product = (await agent.get(`/products/1`).expect(HttpStatus.OK)).body
    })

    describe('Data', () => {
      it('should match expected data', () => {
        expect(product).toMatchObject(expectedProductDto)
      })
    })
  })

  describe('PUT /products/:code', () => {
    let product: Product

    it('should exist', async () => {
      repositoryMock.findOne.mockReturnValue(expectedProduct)
      repositoryMock.persistAndFlush.mockReturnValue(expectedProductDto)

      product = (await agent.put(`/products/${expectedProduct.code}`).expect(HttpStatus.OK)).body
      expect(repositoryMock.findOne).toHaveBeenCalledWith({ code: expectedProduct.code })
    })

    describe('Data', () => {
      it('should match expected data', () => {
        expect(product).toMatchObject(expectedProductDto)
      })
    })
  })

  describe('DELETE /products/:code', () => {
    it('should exist', async () => {
      repositoryMock.findOne.mockReturnValue(expectedProduct)

      await agent.delete(`/products/${expectedProduct.code}`).expect(HttpStatus.NO_CONTENT)

      expect(repositoryMock.findOne).toHaveBeenCalledWith({ code: expectedProduct.code })
    })
  })
})
