import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from '../../projects/schemas/project.schema';
import { User } from '../../users/schemas/user.schema';

type ReviewDocument = HydratedDocument<Review>;

@Schema()
class Review {
  @ApiProperty({ description: 'Идентификатор', type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Текст', type: String })
  @Prop({ type: String, default: '' })
  text: string;

  @ApiProperty({ description: 'Оценка', type: Number })
  @Prop({ type: Number, default: 0 })
  rating: number;

  @ApiProperty({ description: 'Проект', type: Project })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null })
  project: Project;

  @ApiProperty({ description: 'Рецензент', type: User })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  reviewer: User;

  @ApiProperty({ description: 'Пользователи, поставившие лайки', type: [mongoose.Types.ObjectId] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
  likes: mongoose.Types.ObjectId[];

  @ApiProperty({ description: 'Пользователи, поставившие дизлайки', type: [mongoose.Types.ObjectId] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
  dislikes: mongoose.Types.ObjectId[];
}

const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.index({ text: 'text' });
ReviewSchema.set('timestamps', {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export { Review, ReviewDocument, ReviewSchema };
