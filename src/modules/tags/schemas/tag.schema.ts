import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';

type TagDocument = HydratedDocument<Tag>;

@Schema()
class Tag {
  @ApiProperty({ description: 'Идентификатор', type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Название', type: String })
  @Prop({ type: String, default: '' })
  name: string;

  @ApiProperty({ description: 'Ссылка на иконку', type: String })
  @Prop({ type: String, default: '' })
  icon: string;

  @ApiProperty({ description: 'Описание', type: String })
  @Prop({ type: String, default: '' })
  description: string;

  @ApiProperty({ description: 'Ключевое слово', type: String })
  @Prop({ type: String, unique: true, default: '' })
  slug: string;
}

const TagSchema = SchemaFactory.createForClass(Tag);
TagSchema.set('timestamps', {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export { Tag, TagDocument, TagSchema };
