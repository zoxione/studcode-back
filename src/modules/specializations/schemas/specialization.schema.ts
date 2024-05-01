import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';

type SpecializationDocument = HydratedDocument<Specialization>;

@Schema()
class Specialization {
  @ApiProperty({ description: 'Идентификатор', type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Название', type: String })
  @Prop({ type: String, default: '' })
  name: string;

  @ApiProperty({ description: 'Описание', type: String })
  @Prop({ type: String, default: '' })
  description: string;
}

const SpecializationSchema = SchemaFactory.createForClass(Specialization);
SpecializationSchema.index({ name: 'text' });
SpecializationSchema.set('timestamps', {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export { Specialization, SpecializationDocument, SpecializationSchema };
