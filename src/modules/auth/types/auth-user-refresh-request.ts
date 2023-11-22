import { Request } from 'express';
import { JwtPayload } from './jwt-payload';

export type AuthUserRefreshRequest = Request & {
  user: JwtPayload & { refresh_token: string };
};
