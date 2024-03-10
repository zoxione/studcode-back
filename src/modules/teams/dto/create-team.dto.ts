import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { TeamStatus } from '../types/team-status';
import { TeamMemberDto } from './team-member.dto';

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
  readonly status: TeamStatus;

  @ApiProperty({ description: 'Ссылка на логотип', type: String })
  @IsUrl()
  @IsOptional()
  readonly logo: string;

  @ApiProperty({ description: 'Ключевое слово', type: String })
  @IsString()
  @IsOptional()
  readonly slug: string;

  @ApiProperty({ description: 'Участники', type: [TeamMemberDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  @IsOptional()
  readonly members: TeamMemberDto[];
}
