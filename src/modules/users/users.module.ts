import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsModule } from '../projects/projects.module';
import { Reaction, ReactionSchema } from '../reactions/schemas/reaction.schema';
import { ReviewsModule } from '../reviews/reviews.module';
import { TeamsModule } from '../teams/teams.module';
import { Token, TokenSchema } from '../tokens/schemas/token.schema';
import { UploadModule } from '../upload/upload.module';
import { Vote, VoteSchema } from '../votes/schemas/vote.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    MongooseModule.forFeature([{ name: Vote.name, schema: VoteSchema }]),
    MongooseModule.forFeature([{ name: Reaction.name, schema: ReactionSchema }]),
    ReviewsModule,
    ProjectsModule,
    TeamsModule,
    UploadModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
