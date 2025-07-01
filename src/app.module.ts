import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './api/auth/auth.module';
import { AppConfigModule } from './shared/services/config-service/config.module';
import { UserModule } from './api/user/user.module';
import { PrismaModule } from './shared/services/prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AppConfigModule, RedisModule, PrismaModule, AuthModule, UserModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
