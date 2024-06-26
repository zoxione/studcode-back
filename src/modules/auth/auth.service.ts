import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { Tokens } from './types/tokens';
import { JwtPayload } from './types/jwt-payload';
import { Session } from './types/session';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(user: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashData(user.password);
    const createdUser = await this.usersService.createOne({
      ...user,
      password: hashedPassword,
    });
    return createdUser;
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<Tokens & { session: Session } & { access_token_exp: number; refresh_token_exp: number }> {
    const user = await this.usersService.findOne({
      fields: ['email'],
      fieldValue: email,
      secret: true,
    });
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Password is incorrect');
    }
    const tokens = await this.getTokens(user._id.toString(), user.username, user.email, user.role, user.avatar);
    await this.updateRefreshToken(user._id.toString(), tokens.refresh_token);
    const access_token_decode = this.jwtService.decode(tokens.access_token) as JwtPayload;
    const refresh_token_decode = this.jwtService.decode(tokens.refresh_token) as JwtPayload;
    return {
      session: { _id: user._id.toString(), username: user.username, email: user.email, role: user.role, avatar: user.avatar },
      ...tokens,
      access_token_exp: access_token_decode.exp,
      refresh_token_exp: refresh_token_decode.exp,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne({
      fields: ['_id'],
      fieldValue: userId,
      secret: true,
    });
    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access denied');
    }
    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refresh_token);
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access denied');
    }
    const tokens = await this.getTokens(user._id.toString(), user.username, user.email, user.role, user.avatar);
    await this.updateRefreshToken(user._id.toString(), tokens.refresh_token);
    const access_token_decode = this.jwtService.decode(tokens.access_token) as JwtPayload;
    const refresh_token_decode = this.jwtService.decode(tokens.refresh_token) as JwtPayload;
    return { ...tokens, access_token_exp: access_token_decode.exp, refresh_token_exp: refresh_token_decode.exp };
  }

  async signOut(userId: string) {
    const updatedUser = await this.usersService.updateOne({
      fields: ['_id'],
      fieldValue: userId,
      updateDto: { refresh_token: '' },
    });
    if (updatedUser.refresh_token !== '') {
      throw new BadRequestException('Unknown error');
    }
    return { message: 'User logout' };
  }

  async hashData(data: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.updateOne({
      fields: ['_id'],
      fieldValue: userId,
      updateDto: { refresh_token: hashedRefreshToken },
    });
  }

  async getTokens(userId: string, username: string, email: string, role: string, avatar: string): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          email,
          role,
          avatar,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          email,
          role,
          avatar,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
        },
      ),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }
}
