import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { TeamStatus } from '../types/team-status';
import { TeamMember } from '../schemas/team-member.schema';

export class CreateTeamDto {
  @ApiProperty({ description: 'Название', type: String })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'О команде', type: String })
  @IsString()
  @IsOptional()
  readonly about: string;

  @ApiProperty({ description: 'Статус', type: String, enum: TeamStatus })
  @IsEnum(TeamStatus)
  @IsOptional()
  readonly status: string;

  @ApiProperty({ description: 'Ссылка на логотип', type: String })
  @IsUrl()
  @IsOptional()
  readonly logo: string;

  @ApiProperty({ description: 'Участники', type: [TeamMember] })
  @IsArray()
  // @IsString({ each: true })
  readonly members: TeamMember[];

  @ApiProperty({ description: 'Проекты', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly projects: string[];
}
