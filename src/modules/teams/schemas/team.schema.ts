import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from '../../projects/schemas/project.schema';
import { TeamStatus } from '../types/team-status';
import { TeamMember, TeamMemberSchema } from './team-member.schema';

type TeamDocument = HydratedDocument<Team>;

@Schema()
class Team {
  @ApiProperty({ description: 'Идентификатор', type: mongoose.Types.ObjectId })
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Название', type: String })
  @Prop({ type: String, unique: true, default: '' })
  name: string;

  @ApiProperty({ description: 'О команде', type: String })
  @Prop({ type: String, default: '' })
  about: string;

  @ApiProperty({ description: 'Статус', type: String, enum: TeamStatus })
  @Prop({ type: String, enum: TeamStatus, default: TeamStatus.Closed })
  status: string;

  @ApiProperty({ description: 'Ссылка на логотип', type: String })
  @Prop({ type: String, default: '' })
  logo: string;

  @ApiProperty({ description: 'Участники', type: [TeamMember] })
  @Prop({ type: [TeamMemberSchema], default: [] })
  members: TeamMember[];

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

export { Team, TeamDocument, TeamSchema };
