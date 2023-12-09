import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DblistModule } from './dblist/dblist.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import * as Joi from '@hapi/joi'

@Module({
  imports: [DblistModule, UserModule, ConfigModule.forRoot({

    validationSchema : Joi.object({
    POSTGRES_HOST : Joi.string().required(),
    POSTGRES_PORT : Joi.string().required(),
    POSTGRES_USER : Joi.string().required(),
    POSTGRES_PASSWORD : Joi.string().required(),
    POSTGRES_DB : Joi.string().required(),


    JWT_ACCESS_TOKEN_SECRET : Joi.string().required(),
    JWT_ACCESS_TOKEN_EXPIRATION_TIME : Joi.string().required(),

    REDIS_HOST  : Joi.string().required(),
    REDIS_PORT : Joi.number().required(),
    REDIS_USER  : Joi.string().required(),
    REDIS_PASSWORD  : Joi.string().required(),
    REDIS_TTL : Joi.number().required(),

    EMAIL_SERVICE : Joi.string().required(),
    EMAIL_USER : Joi.string().required(),
    EMAIL_PASSWORD: Joi.string().required(),


  })

  }), AuthModule, RedisModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
