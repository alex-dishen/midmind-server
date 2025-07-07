import { verify } from 'argon2';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { JwtTokenDecode } from './types/types';
import { AuthRepository } from './auth.repository';
import { AuthDto, SignUpDto, SingInDto } from './dto/auth.dto';
import { MessageDto } from 'src/shared/dtos/message.dto';
import { UserRepository } from '../user/user.repository';
import { ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private tokenService: TokenService,
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
  ) {}

  async signIn(data: SingInDto): Promise<AuthDto> {
    const user = await this.userRepository.getUserBy({ email: data.email });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const passwordsMatch = await verify(user.password, data.password);

    if (!passwordsMatch) throw new ForbiddenException('Credentials incorrect');

    const sessionsId = randomUUID();

    const { accessToken, refreshToken, refreshExpiresIn, refreshTokenKey, hashedRefreshToken } =
      await this.tokenService.createTokens(user.id, sessionsId);

    await this.authRepository.createOrUpdateUserSession(refreshTokenKey, hashedRefreshToken, refreshExpiresIn);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async signUp(data: SignUpDto): Promise<AuthDto> {
    const user = await this.userRepository.createUser(data);

    const sessionsId = randomUUID();

    const { accessToken, refreshToken, refreshExpiresIn, refreshTokenKey, hashedRefreshToken } =
      await this.tokenService.createTokens(user.id, sessionsId);

    await this.authRepository.createOrUpdateUserSession(refreshTokenKey, hashedRefreshToken, refreshExpiresIn);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshAccessToken(userId: string, refreshToken?: string): Promise<AuthDto> {
    if (!refreshToken) throw new UnauthorizedException('Refresh token not found');

    const decoded = await this.tokenService.decodeToken(refreshToken);
    const sessionId = decoded['sub'];

    try {
      await this.tokenService.verifyRefreshToken(refreshToken);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'TokenExpiredError') {
          const refreshTokenKey = this.tokenService.getRefreshTokenKey(userId, sessionId);
          await this.authRepository.deleteUserSession(refreshTokenKey);

          throw new UnauthorizedException({
            message: 'JWT token is no longer valid',
          });
        }

        throw new UnauthorizedException({
          message: error.message,
        });
      } else {
        throw new InternalServerErrorException({ message: 'Unknown Error' });
      }
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      refreshExpiresIn,
      refreshTokenKey,
      hashedRefreshToken,
    } = await this.tokenService.createTokens(userId, sessionId);

    const userRefreshToken = await this.authRepository.getUserSessionById(refreshTokenKey);

    if (!userRefreshToken) throw new ForbiddenException('Access denied');

    const refreshTokenMatch = await verify(userRefreshToken, refreshToken);

    if (!refreshTokenMatch) throw new ForbiddenException('Access denied');

    await this.authRepository.createOrUpdateUserSession(refreshTokenKey, hashedRefreshToken, refreshExpiresIn);

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
    };
  }

  async logout(userId: string, refreshToken: string): Promise<MessageDto> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const decoded = await this.jwtService.decode<Promise<JwtTokenDecode>>(refreshToken);
    const sessionId = decoded['sub'];

    const refreshTokenKey = this.tokenService.getRefreshTokenKey(userId, sessionId);

    await this.authRepository.deleteUserSession(refreshTokenKey);

    return { message: 'Successfully logged out' };
  }
}
