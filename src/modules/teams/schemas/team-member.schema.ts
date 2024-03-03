import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { TeamMemberRole } from '../types/team-member-role';

@Schema({ _id: false })
class TeamMember {
  @ApiProperty({ description: 'Идентификатор участника', type: mongoose.Types.ObjectId })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Роль', type: String, enum: TeamMemberRole })
  @Prop({ type: String, enum: TeamMemberRole, default: TeamMemberRole.Member })
  role: string;
}

const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);
export { TeamMember, TeamMemberSchema };
