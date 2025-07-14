import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/db/db.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from 'src/api/auth/auth.module';
import { UserModule } from 'src/api/user/user.module';
import { ChatModule } from 'src/api/chat/chat.module';
import { AppConfigModule } from 'src/shared/services/config-service/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AppConfigModule,
    DatabaseModule,
    RedisModule,
    AuthModule,
    UserModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
