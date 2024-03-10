import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { ReviewReactionType } from '../types/review-reaction-type';
import { Review } from './review.schema';

type ReviewReactionDocument = HydratedDocument<ReviewReaction>;

@Schema()
class ReviewReaction {
  @ApiProperty({ description: 'Идентификатор', type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Тип', type: String, enum: ReviewReactionType })
  @Prop({ type: String, enum: ReviewReactionType, default: ReviewReactionType.None })
  type: string;

  @ApiProperty({ description: 'Пользователь', type: User })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  reacted_by: User;

  @ApiProperty({ description: 'Обзор', type: Review })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Review', default: null })
  review: Review;
}

const ReviewReactionSchema = SchemaFactory.createForClass(ReviewReaction);
ReviewReactionSchema.index({ text: 'text' });
ReviewReactionSchema.set('timestamps', {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export { ReviewReaction, ReviewReactionDocument, ReviewReactionSchema };
