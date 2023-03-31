import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import request, { SuperAgentTest } from 'supertest'
import { setupFixture } from './utils'
import { AppModule } from 'src/app.module'

describe('App Module (e2e)', () => {
  let app: INestApplication
  let agent: SuperAgentTest
  let server: any

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
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

  describe('Health Check', () => {
    let health

    it('should be accessible', async () => {
      health = (await agent.get('').expect(HttpStatus.OK)).body
    })

    describe('Structure', () => {
      it('should contain DB Health', async () => {
        expect(health).toHaveProperty('dbStatus')
      })

      it('should contain last CRON date', async () => {
        expect(health).toHaveProperty('lastCronRun')
      })

      it('should contain uptime', async () => {
        expect(health).toHaveProperty('uptime')
      })
    })
  })
})
