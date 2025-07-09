import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/db.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { AppConfigModule } from './shared/services/config-service/config.module';
import { ChatModule } from './api/chat/chat.module';
import { MessageModule } from './api/message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AppConfigModule,
    DatabaseModule,
    RedisModule,
    AuthModule,
    UserModule,
    ChatModule,
    MessageModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
