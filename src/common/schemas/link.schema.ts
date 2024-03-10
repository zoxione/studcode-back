import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { LinkType } from '../types/link-type';

@Schema({ _id: false })
class Link {
  @ApiProperty({ description: 'Тип', type: String, enum: LinkType })
  @Prop({ type: String, enum: LinkType, default: LinkType.Other })
  type: string;

  @ApiProperty({ description: 'Метка', type: String })
  @Prop({ type: String, default: '' })
  label: string;

  @ApiProperty({ description: 'URL', type: String })
  @Prop({ type: String, default: '' })
  url: string;
}

const LinkSchema = SchemaFactory.createForClass(Link);
export { Link, LinkSchema };
