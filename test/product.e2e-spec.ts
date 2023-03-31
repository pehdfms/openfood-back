import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import request, { SuperAgentTest } from 'supertest'
import { setupFixture } from './utils'
import { ProductModule } from '@modules/product/product.module'
import { PaginationResponse } from '@libs/types/pagination'

describe('Product Module (e2e)', () => {
  let app: INestApplication
  let agent: SuperAgentTest
  let server: any

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    setupFixture(app)

    await app.init()

    server = app.getHttpServer()
    agent = request.agent(server)
  })

  afterEach(async () => {
    await app.close()
    server.close()
  })

  describe('GET /products', () => {
    let products: PaginationResponse<string>

    it('should exist', async () => {
      products = (await agent.get('/products').expect(HttpStatus.OK)).body
    })

    it('should be paginated', () => {
      expect(products).toHaveProperty('data')
      expect(products).toHaveProperty('page')

      expect(products.page).toHaveProperty('perPage')
      expect(products.page).toHaveProperty('totalItems')
      expect(products.page).toHaveProperty('totalPages')
      expect(products.page).toHaveProperty('current')
    })
  })
  describe('GET /products/:code', () => {})
  describe('PUT /products/:code', () => {})
  describe('DELETE /products/:code', () => {})
})
