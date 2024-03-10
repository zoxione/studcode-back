import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Link, LinkSchema } from '../../../common/schemas/link.schema';
import { Tag } from '../../tags/schemas/tag.schema';
import { ProjectPrice } from '../types/project-price';
import { ProjectStatus } from '../types/project-status';
import { ProjectType } from '../types/project-type';
import { Team } from '../../teams/schemas/team.schema';
import { User } from '../../users/schemas/user.schema';

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

  @ApiProperty({ description: 'Тип', type: String, enum: ProjectType })
  @Prop({ type: String, enum: ProjectType, default: ProjectType.Other })
  type: string;

  @ApiProperty({ description: 'Описание', type: String })
  @Prop({ type: String, default: '' })
  description: string;

  @ApiProperty({ description: 'Количество огоньков', type: Number })
  @Prop({ type: Number, default: 0 })
  flames: number;

  @ApiProperty({ description: 'Ссылки', type: [Link] })
  @Prop({ type: [LinkSchema], default: [] })
  links: Link[];

  @ApiProperty({ description: 'Ссылка на логотип', type: String })
  @Prop({ type: String, default: '' })
  logo: string;

  @ApiProperty({ description: 'Скриншоты', type: [String] })
  @Prop({ type: [String], default: [] })
  screenshots: string[];

  @ApiProperty({ description: 'Цена', type: String, enum: ProjectPrice })
  @Prop({ type: String, enum: ProjectPrice, default: ProjectPrice.Free })
  price: string;

  @ApiProperty({ description: 'Рейтинг', type: Number })
  @Prop({ type: Number, default: 0.0 })
  rating: number;

  @ApiProperty({ description: 'Ключевое слово', type: String })
  @Prop({ type: String, unique: true, default: '' })
  slug: string;

  @ApiProperty({ description: 'Создатель', type: User })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  creator: User;

  @ApiProperty({ description: 'Команда', type: Team })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null })
  team: Team;

  @ApiProperty({ description: 'Теги', type: [Tag] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }], default: [] })
  tags: Tag[];
}

const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ title: 'text' });
ProjectSchema.set('timestamps', {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export { Project, ProjectDocument, ProjectSchema };
