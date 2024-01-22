import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ description: 'Название', type: String })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'О команде', type: String })
  @IsString()
  @IsOptional()
  readonly about: string;

  @ApiProperty({ description: 'Ссылка на логотип', type: String })
  @IsString()
  @IsUrl()
  @IsOptional()
  readonly logo: string;

  @ApiProperty({ description: 'Участники', type: [String] })
  @IsArray()
  @IsString({ each: true })
  readonly users: string[];

  @ApiProperty({ description: 'Проекты', type: [String] })
  @IsArray()
  @IsString({ each: true })
  readonly projects: string[];
}
