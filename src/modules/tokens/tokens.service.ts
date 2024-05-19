import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from './schemas/token.schema';

@Injectable()
export class TokensService {
  constructor(@InjectModel(Token.name) private readonly tokenModel: Model<Token>) {}
}
