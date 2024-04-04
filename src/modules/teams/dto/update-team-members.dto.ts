import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { TeamAction } from '../types/team-action';
import { TeamMemberDto } from './team-member.dto';

class UpdateTeamMembersItemDto {
  @ApiProperty({ description: 'Участник', type: TeamMemberDto })
  @IsObject()
  @ValidateNested()
  @Type(() => TeamMemberDto)
  readonly member: TeamMemberDto;

  @ApiProperty({ description: 'Действие', type: String, enum: TeamAction })
  @IsEnum(TeamAction)
  readonly action: TeamAction;
}

export class UpdateTeamMembersDto {
  @ApiProperty({ description: 'Участники', type: [UpdateTeamMembersItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTeamMembersItemDto)
  readonly members: UpdateTeamMembersItemDto[];
}
