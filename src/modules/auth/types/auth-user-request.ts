import { Request } from 'express';
import { JwtPayload } from './jwt-payload';

export type AuthUserRequest = Request & {
  user: JwtPayload;
};
