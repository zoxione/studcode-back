import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from '../../projects/schemas/project.schema';
import { User } from '../../users/schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

type TeamDocument = HydratedDocument<Team>;

@Schema()
class Team {
  @ApiProperty({ description: 'Идентификатор', type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Название', type: String })
  @Prop({ type: String, default: '' })
  name: string;

  @ApiProperty({ description: 'О команде', type: String })
  @Prop({ type: String, default: '' })
  about: string;

  @ApiProperty({ description: 'Ссылка на логотип', type: String })
  @Prop({ type: String, default: '' })
  logo: string;

  @ApiProperty({ description: 'Участники', type: [User] })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
  users: User[];

  @ApiProperty({ description: 'Проекты', type: [Project] })
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
