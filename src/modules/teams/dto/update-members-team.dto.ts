import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { TeamAction } from '../types/team-action';
import { TeamMemberDto } from './team-member.dto';

class UpdateMembersTeamItemDto {
  @ApiProperty({ description: 'Участник', type: TeamMemberDto })
  @IsObject()
  @ValidateNested()
  @Type(() => TeamMemberDto)
  readonly member: TeamMemberDto;

  @ApiProperty({ description: 'Действие', type: String, enum: TeamAction })
  @IsEnum(TeamAction)
  readonly action: TeamAction;
}

export class UpdateMembersTeamDto {
  @ApiProperty({ description: 'Участники', type: [UpdateMembersTeamItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMembersTeamItemDto)
  readonly members: UpdateMembersTeamItemDto[];
}
