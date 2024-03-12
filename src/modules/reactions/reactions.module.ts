import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';
import { Reaction, ReactionSchema } from './schemas/reaction.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Reaction.name, schema: ReactionSchema }])],
  controllers: [ReactionsController],
  providers: [ReactionsService],
  exports: [ReactionsService],
})
export class ReactionsModule {}
