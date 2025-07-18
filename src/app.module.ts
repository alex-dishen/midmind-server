import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LLMModule } from 'src/llm/llm.module';
import { DatabaseModule } from 'src/db/db.module';
import { RedisModule } from 'src/redis/redis.module';
import { AuthModule } from 'src/api/auth/auth.module';
import { UserModule } from 'src/api/user/user.module';
import { ChatModule } from 'src/api/chat/chat.module';
import { AppConfigModule } from 'src/shared/services/config-service/config.module';
import { validateEnv } from 'src/shared/services/config-service/env-variables/validate-env';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv, cache: true }),
    AppConfigModule,
    DatabaseModule,
    RedisModule,
    AuthModule,
    UserModule,
    ChatModule,
    LLMModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
