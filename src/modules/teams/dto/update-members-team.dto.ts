import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { TeamAction } from '../types/team-action';
import { TeamMemberRole } from '../types/team-member-role';

class PayloadDto {
  @ApiProperty({ description: 'Пользователь', type: String })
  @IsString()
  readonly user: string;

  @ApiProperty({ description: 'Роль', type: String, enum: TeamMemberRole })
  @IsEnum(TeamMemberRole)
  @IsOptional()
  readonly role: string;
}

class UpdateMemberActionDto {
  @ApiProperty({ description: 'Полезная информация', type: PayloadDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PayloadDto)
  readonly payload: PayloadDto;

  @ApiProperty({ description: 'Действие', type: String, enum: TeamAction })
  @IsEnum(TeamAction)
  readonly action: string;
}

export class UpdateMembersTeamDto {
  @ApiProperty({ description: 'Участники', type: [UpdateMemberActionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMemberActionDto)
  readonly members: UpdateMemberActionDto[];
}
