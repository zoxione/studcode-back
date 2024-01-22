import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { AwardNameDto } from '../dto/award-name.dto';

type AwardDocument = HydratedDocument<Award>;

@Schema()
class Award {
  @ApiProperty({ description: 'Идентификатор', type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Название', type: AwardNameDto })
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
}

const AwardSchema = SchemaFactory.createForClass(Award);
AwardSchema.index({ 'name.ru': 'text' });
AwardSchema.set('timestamps', {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export { Award, AwardDocument, AwardSchema };
