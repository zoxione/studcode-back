import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import configuration from '../../../config/configuration';
import { JwtPayload } from '../types/jwt-payload';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([RefreshTokenStrategy.extractRefreshToken]),
      ignoreExpiration: false,
      secretOrKey: configuration().jwt_refresh_secret,
      passReqToCallback: true,
    });
  }

  private static extractRefreshToken(req: Request): string | null {
    if (req.cookies && req.cookies[configuration().refresh_token_name]) {
      return req.cookies[configuration().refresh_token_name];
    }
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }

  validate(req: Request, payload: JwtPayload) {
    let refresh_token = req.get('Authorization')?.replace('Bearer', '').trim();
    if (typeof refresh_token !== 'string') {
      refresh_token = req.cookies[configuration().refresh_token_name];
    }
    return { ...payload, refresh_token };
  }
}
