import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from '../../projects/schemas/project.schema';
import { User } from '../../users/schemas/user.schema';

type VoteDocument = HydratedDocument<Vote>;

@Schema()
class Vote {
  @ApiProperty({ description: 'Идентификатор', type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Проект', type: Project })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null })
  project: Project;

  @ApiProperty({ description: 'Голосующий', type: User })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  voter: User;
}

const VoteSchema = SchemaFactory.createForClass(Vote);
VoteSchema.index({ project: 'text' });
VoteSchema.set('timestamps', {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export { Vote, VoteDocument, VoteSchema };
