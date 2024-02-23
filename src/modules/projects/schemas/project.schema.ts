import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ProjectPrice } from '../types/project-price';
import { ProjectStatus } from '../types/project-status';
import { Tag } from '../../tags/schemas/tag.schema';
import { User } from '../../users/schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectLinksDto } from '../dto/project-links.dto';

type ProjectDocument = HydratedDocument<Project>;

@Schema()
class Project {
  @ApiProperty({ description: 'Идентификатор', type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Название', type: String })
  @Prop({ type: String, default: '' })
  title: string;

  @ApiProperty({ description: 'Слоган', type: String })
  @Prop({ type: String, default: '' })
  tagline: string;

  @ApiProperty({ description: 'Статус', type: String, enum: ProjectStatus })
  @Prop({ type: String, enum: ProjectStatus, default: ProjectStatus.Draft })
  status: string;

  @ApiProperty({ description: 'Описание', type: String })
  @Prop({ type: String, default: '' })
  description: string;

  @ApiProperty({ description: 'Количество огоньков', type: Number })
  @Prop({ type: Number, default: 0 })
  flames: number;

  @ApiProperty({ description: 'Ссылки', type: ProjectLinksDto })
  @Prop(
    raw({
      main: { type: String, default: '' },
      github: { type: String, default: '' },
      demo: { type: String, default: '' },
    }),
  )
  links: {
    main: string;
    github: string;
    demo: string;
  };

  @ApiProperty({ description: 'Ссылка на логотип', type: String })
  @Prop({ type: String, default: '' })
  logo: string;

  @ApiProperty({ description: 'Массив скриншотов', type: [String] })
  @Prop({ type: [String], default: [] })
  screenshots: string[];

  @ApiProperty({ description: 'Цена', type: String, enum: ProjectPrice })
  @Prop({ type: String, enum: ProjectPrice, default: ProjectPrice.Free })
  price: string;

  @ApiProperty({ description: 'Рейтинг', type: Number })
  @Prop({ type: Number, default: 0.0 })
  rating: number;

  @ApiProperty({ description: 'Ключевое слово', type: String })
  @Prop({ type: String, default: '' })
  slug: string;

  @ApiProperty({ description: 'Теги', type: [Tag] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }], default: [] })
  tags: Tag[];

  @ApiProperty({ description: 'Создатель', type: User })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  creator: User;
}

const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ title: 'text' });
ProjectSchema.set('timestamps', {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export { ProjectDocument, Project, ProjectSchema };
