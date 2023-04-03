import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication } from '@nestjs/common'
import request, { SuperAgentTest } from 'supertest'
import { setupFixture } from './utils'
import { AppModule } from 'src/app.module'
import { HealthCheckResults } from '@app.controller'

describe('App Module (e2e)', () => {
  let app: INestApplication
  let agent: SuperAgentTest
  let server: any

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    setupFixture(app)

    await app.init()

    server = app.getHttpServer()
    agent = request.agent(server)
  })

  afterAll(async () => {
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

      it('should be up', () => {
        expect(health.dbStatus).toBe('up')
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

      it('should increase with time', async () => {
        // Wait for 10 ms
        await new Promise((r) => setTimeout(r, 10))

        const newUptime: number = (await agent.get('').expect(HttpStatus.OK)).body.uptime
        expect(newUptime).toBeGreaterThan(health.uptime)
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
