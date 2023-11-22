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

  @Prop({ type: String, default: '' })
  icon: string;
}

const TagSchema = SchemaFactory.createForClass(Tag);
TagSchema.index({ 'name.ru': 'text' });
TagSchema.set('timestamps', {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export { TagDocument, Tag, TagSchema };
