import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';

type EducationDocument = HydratedDocument<Education>;

@Schema()
class Education {
  @ApiProperty({ description: 'Идентификатор', type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Аббревиатура', type: String })
  @Prop({ type: String, default: '' })
  abbreviation: string;

  @ApiProperty({ description: 'Название', type: String })
  @Prop({ type: String, default: '' })
  name: string;

  @ApiProperty({ description: 'Описание', type: String })
  @Prop({ type: String, default: '' })
  description: string;

  @ApiProperty({ description: 'Ссылка на логотип', type: String })
  @Prop({ type: String, default: '' })
  logo: string;
}

const EducationSchema = SchemaFactory.createForClass(Education);
EducationSchema.index({ name: 'text' });
EducationSchema.set('timestamps', {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export { Education, EducationDocument, EducationSchema };
