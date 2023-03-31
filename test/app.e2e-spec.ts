import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import request, { SuperAgentTest } from 'supertest'
import { setupFixture } from './utils'
import { AppModule } from 'src/app.module'
import { HealthCheckResults } from '@app.service'

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
    let health: HealthCheckResults

    it('should be accessible', async () => {
      health = (await agent.get('').expect(HttpStatus.OK)).body
    })

    describe('DB Health', () => {
      it('should be visible', () => {
        expect(health).toHaveProperty('dbStatus')
      })

      it('should be ok', () => {
        expect(health.dbStatus).toBe('ok')
      })
    })

    describe('Last CRON Run', () => {
      it('should be visible', () => {
        expect(health).toHaveProperty('lastCronRun')
      })
    })

    describe('Uptime', () => {
      it('should be visible', () => {
        expect(health).toHaveProperty('uptime')
      })

      it('should be non zero', () => {
        expect(health.uptime).toBeGreaterThan(0)
      })
    })

    describe('Memory Usage', () => {
      it('should be visible', () => {
        expect(health).toHaveProperty('memoryUsage')
      })

      it('should be non empty', () => {
        expect(health.memoryUsage.length).toBeGreaterThan(0)
      })

      it('should be non zero', () => {
        expect(health.memoryUsage.at(0)).not.toBe('0')
      })
    })
  })
})
