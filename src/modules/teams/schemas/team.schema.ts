import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from '../../projects/schemas/project.schema';
import { User } from '../../users/schemas/user.schema';

type TeamDocument = HydratedDocument<Team>;

@Schema()
class Team {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: String, default: '' })
  name: string;

  @Prop({ type: String, default: '' })
  about: string;

  @Prop({ type: String, default: '' })
  avatar: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
  users: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }], default: [] })
  projects: Project[];
}

const TeamSchema = SchemaFactory.createForClass(Team);
TeamSchema.index({ name: 'text' });
TeamSchema.set('timestamps', {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export { TeamDocument, Team, TeamSchema };
