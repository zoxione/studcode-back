import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { ProjectPrice } from '../types/project-price';
import { ProjectStatus } from '../types/project-status';
import { ProjectLinksDto } from './project-links.dto';

export class CreateProjectDto {
  @ApiProperty({ description: 'Название', type: String })
  @IsString()
  readonly title: string;

  @ApiProperty({ description: 'Слоган', type: String })
  @IsString()
  @IsOptional()
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
  @IsObject()
  @ValidateNested()
  @Type(() => ProjectLinksDto)
  @IsOptional()
  readonly links: ProjectLinksDto;

  @ApiProperty({ description: 'Ссылка на логотип', type: String })
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

  @ApiProperty({ description: 'Рейтинг', type: Number })
  @IsNumber()
  @IsOptional()
  readonly rating: number;

  @ApiProperty({ description: 'Теги', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly tags: string[];

  @ApiProperty({ description: 'Создатель', type: String })
  @IsString()
  readonly creator: string;
}
