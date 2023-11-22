import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

type AwardDocument = HydratedDocument<Award>;

@Schema()
class Award {
  _id: mongoose.Types.ObjectId;

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
