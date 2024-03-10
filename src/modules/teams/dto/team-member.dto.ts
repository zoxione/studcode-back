import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TeamMemberRole } from '../types/team-member-role';

export class TeamMemberDto {
  @ApiProperty({ description: 'Пользователь', type: String })
  @IsString()
  readonly user: string;

  @ApiProperty({ description: 'Роль', type: String, enum: TeamMemberRole })
  @IsEnum(TeamMemberRole)
  @IsOptional()
  readonly role: TeamMemberRole;
}
