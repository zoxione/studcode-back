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
import { Token } from '../tokens/schemas/token.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TokenEvent } from '../tokens/types/token-event';

@ApiBearerAuth()
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  @Post('/register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.authService.signUp(createUserDto);
    await this.mailerService.sendMail({
      from: `"Студенческий Код" <${configuration().smtp_mail}>`,
      to: createdUser.email,
      subject: `Регистрация на сайте ${configuration().frontend_url}`,
      html: `
        <div>
          <h1>Регистрация на сайте ${configuration().frontend_url}</h1>
          <p>Спасибо что зарегистрировались на нашем сайте.</p>
          <p>С уважением, команда Студенческого Кода.</p>
        </div>
      `,
    });
    return createdUser;
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
        domain: configuration().token_domain,
        httpOnly: true,
        secure: configuration().node_env === 'production',
        sameSite: configuration().node_env === 'production' ? 'lax' : 'lax',
        maxAge: (access_token_exp - nowUnix) * 1000,
      })
      .cookie(configuration().refresh_token_name, refresh_token, {
        domain: configuration().token_domain,
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
    response.clearCookie(configuration().access_token_name);
    response.clearCookie(configuration().refresh_token_name);
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
        domain: configuration().token_domain,
        httpOnly: true,
        secure: configuration().node_env === 'production',
        sameSite: configuration().node_env === 'production' ? 'lax' : 'lax',
        maxAge: (access_token_exp - nowUnix) * 1000,
      })
      .cookie(configuration().refresh_token_name, refresh_token, {
        domain: configuration().token_domain,
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
      role: req.user.role,
      avatar: req.user.avatar,
    };
  }

  @UseGuards(AccessTokenGuard)
  @Get('/verify')
  @ApiOperation({ summary: 'Подтверждение почты' })
  async verifyEmail(@Req() req: AuthUserRequest, @Query() query: VerifyEmailDto, @Res() res: Response): Promise<any> {
    const user = await this.usersService.findOne({ fields: ['_id'], fieldValue: req.user.sub });
    if (user.verify_email) {
      throw new BadRequestException('User already verified');
    }
    if (query.token) {
      const token = await this.tokenModel.findOne({ event: TokenEvent.VerifyEmail, user: user._id, content: query.token });
      if (!token) {
        throw new UnauthorizedException('Invalid token');
      }
      await this.usersService.updateOne({ fields: ['_id'], fieldValue: req.user.sub, updateDto: { verify_email: true } });
      await this.tokenModel.deleteOne({ _id: token._id });
      return res.redirect(configuration().frontend_url);
    } else {
      const randomToken = uuidv4();
      await this.tokenModel.create({
        event: TokenEvent.VerifyEmail,
        content: randomToken,
        user: user._id,
      });
      const link = `${configuration().app_url}/api/v1/auth/verify?token=${randomToken}`;
      await this.mailerService.sendMail({
        from: `"Студенческий Код" <${configuration().smtp_mail}>`,
        to: user.email,
        subject: `Подтверждение почты на сайте ${configuration().frontend_url}`,
        html: `
          <div>
            <h1>Подтверждение почты на сайте ${configuration().frontend_url}</h1>
            <p>Для подтверждения почты перейдите по ссылке:</p>
            <a href="${link}" target="_blank">${link}</a>
            <p>С уважением, команда Студенческого Кода.</p>
          </div>
        `,
      });
      return res.json({ message: 'Check your email', error: 'false', statusCode: 200 });
    }
  }
}
