import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

type TagDocument = HydratedDocument<Tag>;

@Schema()
class Tag {
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
}

const TagSchema = SchemaFactory.createForClass(Tag);
TagSchema.index({ 'name.ru': 'text' });
TagSchema.set('timestamps', true);

export { TagDocument, Tag, TagSchema };
