import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import request, { SuperAgentTest } from 'supertest'
import { setupFixture } from './utils'
import { ProductModule } from '@modules/product/product.module'
import { PaginationResponse } from '@libs/types/pagination'
import { getRepositoryToken, MikroOrmModule } from '@mikro-orm/nestjs'
import { Product } from '@modules/product/entities/product.entity'
import { mockProducts, repositoryMockFactory } from './mocks'

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

  describe('GET /products', () => {
    const expectedProducts = mockProducts
    let products: PaginationResponse<Product>
    const perPage = 5

    it('should exist', async () => {
      repositoryMock.findAndCount.mockReturnValue([expectedProducts, expectedProducts.length])
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
    const expectedProduct = mockProducts[0]
    let product: Product

    it('should exist', async () => {
      repositoryMock.findOne.mockReturnValue(expectedProduct)
      product = (await agent.get(`/products/1`).expect(HttpStatus.OK)).body
    })

    describe('Data', () => {
      it('should match expected data', () => {
        expect(product).toMatchObject(expectedProduct)
      })
    })
  })

  describe('PUT /products/:code', () => {
    const expectedProduct = mockProducts[0]
    let product: Product

    it('should exist', async () => {
      repositoryMock.findOne.mockReturnValue(expectedProduct)
      repositoryMock.persistAndFlush.mockReturnValue(expectedProduct)

      product = (await agent.put(`/products/${expectedProduct.code}`).expect(HttpStatus.OK)).body
      expect(repositoryMock.findOne).toHaveBeenCalledWith({ code: expectedProduct.code })
    })

    describe('Data', () => {
      it('should match expected data', () => {
        expect(product).toMatchObject(expectedProduct)
      })
    })
  })

  describe('DELETE /products/:code', () => {})
})
