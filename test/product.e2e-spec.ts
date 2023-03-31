import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import request, { SuperAgentTest } from 'supertest'
import { setupFixture } from './utils'
import { ProductModule } from '@modules/product/product.module'

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
    let products
    it('should exist', async () => {
      products = (await agent.get('/products').expect(HttpStatus.OK)).body
    })
  })
  describe('GET /products/:code', () => {})
  describe('PUT /products/:code', () => {})
  describe('DELETE /products/:code', () => {})
})
