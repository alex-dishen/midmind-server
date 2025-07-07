import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/db.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './api/auth/auth.module';
import { AppConfigModule } from './shared/services/config-service/config.module';
import { UserModule } from './api/user/user.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AppConfigModule, DatabaseModule, RedisModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
