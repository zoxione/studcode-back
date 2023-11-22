import { AuthUser } from './auth-user';

export type JwtPayload = AuthUser & {
  iat: number;
  exp: number;
};
