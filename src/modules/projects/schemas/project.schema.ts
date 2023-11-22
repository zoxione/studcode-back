import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ProjectPrice } from '../../../common/types/project-price';
import { ProjectStatus } from '../../../common/types/project-status';
import { Tag } from '../../tags/schemas/tag.schema';
import { User } from '../../users/schemas/user.schema';

type ProjectDocument = HydratedDocument<Project>;

@Schema()
class Project {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: String, default: '' })
  title: string;

  @Prop({ type: String, default: '' })
  tagline: string;

  @Prop({ type: String, enum: ProjectStatus, default: ProjectStatus.Draft })
  status: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: Number, default: 0 })
  flames: number;

  @Prop(
    raw({
      main: { type: String, default: '' },
      github: { type: String, default: '' },
      demo: { type: String, default: '' },
    }),
  )
  link: {
    main: string;
    github: string;
    demo: string;
  };

  @Prop({ type: String, default: '' })
  avatar: string;

  @Prop({ type: [String], default: [] })
  screenshots: string[];

  @Prop({ type: String, enum: ProjectPrice, default: ProjectPrice.Free })
  price: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }], default: [] })
  tags: Tag[];

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
