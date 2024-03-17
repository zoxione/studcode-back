import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Body, Controller, Get, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import configuration from '../../config/configuration';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AuthUserRefreshRequest } from './types/auth-user-refresh-request';
import { AuthUserRequest } from './types/auth-user-request';
import { Session } from './types/session';

@ApiBearerAuth()
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

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
    const { access_token, refresh_token, access_token_exp, refresh_token_exp } = await this.authService.refreshTokens(userId, refreshToken);
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

  @UseGuards(AccessTokenGuard)
  @Get('/verify')
  @ApiOperation({ summary: 'Подтверждение почты' })
  async verifyEmail(@Req() req: AuthUserRequest, @Query() query: VerifyEmailDto, @Res() res: Response): Promise<any> {
    const user = await this.usersService.findOne({ fields: ['_id'], fieldValue: req.user.sub });
    if (user.verify_email === 'true') {
      throw new BadRequestException('User already verified');
    }
    if (query.token) {
      if (user.verify_email === query.token) {
        await this.usersService.updateOne({ fields: ['_id'], fieldValue: req.user.sub, updateDto: { verify_email: 'true' } });
        return res.redirect(configuration().frontend_url);
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    } else {
      const randomToken = uuidv4();
      const user = await this.usersService.updateOne({
        fields: ['_id'],
        fieldValue: req.user.sub,
        updateDto: { verify_email: randomToken },
      });
      await this.mailerService.sendMail({
        from: `"Студенческий Код" <${configuration().smtp_mail}>`,
        to: user.email,
        subject: `Подтверждение почты на сайте ${configuration().frontend_url}`,
        html: `
          <div>
            <h1>Подтверждение почты на сайте ${configuration().frontend_url}</h1>
            <p>Для подтверждения почты перейдите по ссылке</p>
            <a href="${configuration().app_url}/api/v1/auth/verify?token=${randomToken}">Ссылка</a>
          </div>
        `,
      });
      return res.json({ message: 'Check your email', error: 'false', statusCode: 200 });
    }
  }
}
