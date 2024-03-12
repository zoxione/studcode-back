import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { ReactionType } from '../types/reaction-type';
import { Review } from '../../reviews/schemas/review.schema';

type ReactionDocument = HydratedDocument<Reaction>;

@Schema()
class Reaction {
  @ApiProperty({ description: 'Идентификатор', type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Тип', type: String, enum: ReactionType })
  @Prop({ type: String, enum: ReactionType, default: ReactionType.None })
  type: string;

  @ApiProperty({ description: 'Пользователь', type: User })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  reacted_by: User;

  @ApiProperty({ description: 'Обзор', type: Review })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Review', default: null })
  review: Review;
}

const ReactionSchema = SchemaFactory.createForClass(Reaction);
ReactionSchema.index({ text: 'text' });
ReactionSchema.set('timestamps', {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export { Reaction, ReactionDocument, ReactionSchema };
