import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Tag } from 'src/modules/tags/schemas/tag.schema';

type ProjectDocument = HydratedDocument<Project>;

@Schema()
class Project {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: String, default: '' })
  title: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: Number, default: 0 })
  flames: number;

  @Prop({ type: String, default: '' })
  link: string;

  @Prop({ type: String, default: '' })
  avatar: string;

  @Prop({ type: [String], default: [] })
  screenshots: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }], default: [] })
  tags: Tag[];
}

const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ title: 'text' });
ProjectSchema.set('timestamps', true);

export { ProjectDocument, Project, ProjectSchema };
