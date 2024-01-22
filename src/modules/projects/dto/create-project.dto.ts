import { IsString, IsInt, IsArray, IsUrl, IsOptional, IsEnum, ValidateNested, IsDefined } from 'class-validator';
import { ProjectStatus } from '../types/project-status';
import { ProjectLinksDto } from './project-links.dto';
import { Type } from 'class-transformer';
import { ProjectPrice } from '../types/project-price';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ description: 'Название', type: String })
  @IsString()
  readonly title: string;

  @ApiProperty({ description: 'Слоган', type: String })
  @IsString()
  readonly tagline: string;

  @ApiProperty({ description: 'Статус', type: String, enum: ProjectStatus })
  @IsEnum(ProjectStatus)
  @IsOptional()
  readonly status: string;

  @ApiProperty({ description: 'Описание', type: String })
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({ description: 'Количество огоньков', type: Number })
  @IsInt()
  @IsOptional()
  readonly flames: number;

  @ApiProperty({ description: 'Ссылки', type: ProjectLinksDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => ProjectLinksDto)
  @IsOptional()
  readonly links: ProjectLinksDto;

  @ApiProperty({ description: 'Ссылка на логотип', type: String })
  @IsString()
  @IsUrl()
  @IsOptional()
  readonly logo: string;

  @ApiProperty({ description: 'Массив скриншотов', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly screenshots: string[];

  @ApiProperty({ description: 'Цена', type: String, enum: ProjectPrice })
  @IsEnum(ProjectPrice)
  @IsOptional()
  readonly price: string;

  @ApiProperty({ description: 'Теги', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly tags: string[];

  @ApiProperty({ description: 'Создатель', type: String })
  @IsString()
  readonly creator: string;
}
