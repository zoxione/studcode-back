import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { SignInReturnDto } from './dto/sign-in-return.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Request } from 'express';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

interface RequestWithAuthUser extends Request {
  user: {
    sub: string;
    username: string;
    iat: number;
    exp: number;
    refresh_token?: string;
  };
}

@ApiBearerAuth()
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signUp(createUserDto);
  }

  @Post('/login')
  login(@Body() signInDto: SignInDto): Promise<SignInReturnDto> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/logout')
  logout(@Req() req: RequestWithAuthUser) {
    return this.authService.signOut(req.user.sub);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  refreshTokens(@Req() req: RequestWithAuthUser) {
    const userId = req.user.sub;
    const refreshToken = req.user.refresh_token || '';
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/whoami')
  whoami(@Req() req: RequestWithAuthUser) {
    return req.user;
  }
}
