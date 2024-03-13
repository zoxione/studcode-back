import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthUserRefreshRequest } from './types/auth-user-refresh-request';
import { AuthUserRequest } from './types/auth-user-request';
import configuration from '../../config/configuration';
import { Session } from './types/session';

@ApiBearerAuth()
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signUp(createUserDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'Аутентификация пользователя' })
  async login(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response: Response) {
    const { access_token, refresh_token, access_token_exp, refresh_token_exp, session } = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    const nowUnix = (+new Date() / 1e3) | 0;
    response
      .cookie(configuration().access_token_name, access_token, {
        httpOnly: true,
        secure: configuration().node_env === 'production',
        sameSite: configuration().node_env === 'production' ? 'lax' : 'lax',
        maxAge: (access_token_exp - nowUnix) * 1000,
      })
      .cookie(configuration().refresh_token_name, refresh_token, {
        httpOnly: true,
        secure: configuration().node_env === 'production',
        sameSite: configuration().node_env === 'production' ? 'lax' : 'lax',
        maxAge: (refresh_token_exp - nowUnix) * 1000,
      })
      .send({ user: session, access_token, access_token_exp, refresh_token, refresh_token_exp });
  }

  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  @ApiOperation({ summary: 'Выход из аккаунта' })
  async logout(@Req() req: AuthUserRequest, @Res({ passthrough: true }) response: Response) {
    response.clearCookie(configuration().access_token_name, {
      httpOnly: true,
      secure: configuration().node_env === 'production',
      sameSite: configuration().node_env === 'production' ? 'lax' : 'lax',
    });
    response.clearCookie(configuration().refresh_token_name, {
      httpOnly: true,
      secure: configuration().node_env === 'production',
      sameSite: configuration().node_env === 'production' ? 'lax' : 'lax',
    });
    return this.authService.signOut(req.user.sub);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  @ApiOperation({ summary: 'Обновление токенов' })
  async refreshTokens(@Req() req: AuthUserRefreshRequest, @Res({ passthrough: true }) response: Response) {
    const userId = req.user.sub;
    const refreshToken = req.user.refresh_token || '';
    const { access_token, refresh_token, access_token_exp, refresh_token_exp } = await this.authService.refreshTokens(
      userId,
      refreshToken,
    );
    const nowUnix = (+new Date() / 1e3) | 0;
    response
      .cookie(configuration().access_token_name, access_token, {
        httpOnly: true,
        secure: configuration().node_env === 'production',
        sameSite: configuration().node_env === 'production' ? 'lax' : 'lax',
        maxAge: (access_token_exp - nowUnix) * 1000,
      })
      .cookie(configuration().refresh_token_name, refresh_token, {
        httpOnly: true,
        secure: configuration().node_env === 'production',
        sameSite: configuration().node_env === 'production' ? 'lax' : 'lax',
        maxAge: (refresh_token_exp - nowUnix) * 1000,
      })
      .send({ access_token, access_token_exp, refresh_token, refresh_token_exp });
  }

  @UseGuards(AccessTokenGuard)
  @Get('/whoami')
  @ApiOperation({ summary: 'Получение информации о текущем пользователе' })
  async whoami(@Req() req: AuthUserRequest): Promise<Session> {
    return {
      _id: req.user.sub,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
    };
  }
}
