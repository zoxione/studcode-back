import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateTeamDto {
  @ApiProperty({ description: 'Название', type: String })
  @IsString()
  @IsOptional()
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
  @IsOptional()
  readonly users: string[];

  @ApiProperty({ description: 'Проекты', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly projects: string[];
}
