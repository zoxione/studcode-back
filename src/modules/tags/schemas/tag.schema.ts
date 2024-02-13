import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { TagNameDto } from '../dto/tag-name.dto';

type TagDocument = HydratedDocument<Tag>;

@Schema()
class Tag {
  @ApiProperty({ description: 'Идентификатор', type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Название', type: TagNameDto })
  @Prop(
    raw({
      en: { type: String, default: '' },
      ru: { type: String, default: '' },
    }),
  )
  name: {
    en: string;
    ru: string;
  };

  @ApiProperty({ description: 'Ссылка на иконку', type: String })
  @Prop({ type: String, default: '' })
  icon: string;

  @ApiProperty({ description: 'Ключевое слово', type: String })
  @Prop({ type: String, default: '' })
  slug: string;

  @ApiProperty({ description: 'Описание', type: String })
  @Prop({ type: String, default: '' })
  description: string;
}

const TagSchema = SchemaFactory.createForClass(Tag);
TagSchema.index({ 'name.ru': 'text' });
TagSchema.set('timestamps', {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export { TagDocument, Tag, TagSchema };
