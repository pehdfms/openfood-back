import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { LoggerModule } from 'nestjs-pino'
import Joi from 'joi'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TerminusModule } from '@nestjs/terminus'
import { ProductModule } from '@modules/product/product.module'
import { SyncModule } from '@modules/sync/sync.module'
import { FetchHistory } from '@modules/sync/entities/fetch-history.entity'

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    TerminusModule,
    ScheduleModule.forRoot(),
    MikroOrmModule.forRoot(),
    MikroOrmModule.forFeature([FetchHistory]),
    ProductModule,
    SyncModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true
          }
        }
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        PORT: Joi.number().required(),
        HOST: Joi.string().required(),
        MODE: Joi.string().required()
      })
    })
  ]
})
export class AppModule {}
