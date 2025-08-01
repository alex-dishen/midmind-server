import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { UserModule } from 'src/api/user/user.module';
import { AuthCookieService } from './auth-cookie.service';

@Module({
  imports: [UserModule, JwtModule.register({ global: true })],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService, AuthCookieService, TokenService],
})
export class AuthModule {}
