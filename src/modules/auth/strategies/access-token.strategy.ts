import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configuration from '../../../config/configuration';
import { Request } from 'express';
import { JwtPayload } from '../types/jwt-payload';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access-token') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([AccessTokenStrategy.extractAccessToken]),
      ignoreExpiration: false,
      secretOrKey: configuration().jwt_access_secret,
    });
  }

  private static extractAccessToken(req: Request): string | null {
    if (req.cookies && req.cookies[configuration().access_token_name]) {
      return req.cookies[configuration().access_token_name];
    }
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
