import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reaction } from './schemas/reaction.schema';

@Injectable()
export class ReactionsService {
  constructor(@InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>) {}
}
