import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { LinkDto } from '../../../common/dto/link.dto';
import { ProjectPrice } from '../types/project-price';
import { ProjectStatus } from '../types/project-status';
import { ProjectType } from '../types/project-type';

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
  readonly status: ProjectStatus;

  @ApiProperty({ description: 'Тип', type: String, enum: ProjectType })
  @IsEnum(ProjectType)
  @IsOptional()
  readonly type: ProjectType;

  @ApiProperty({ description: 'Описание', type: String })
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({ description: 'Количество огоньков', type: Number })
  @IsInt()
  @IsOptional()
  readonly flames: number;

  @ApiProperty({ description: 'Ссылки', type: [LinkDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  @IsOptional()
  readonly links: LinkDto[];

  @ApiProperty({ description: 'Ссылка на логотип', type: String })
  @IsUrl()
  @IsOptional()
  readonly logo: string;

  @ApiProperty({ description: 'Скриншоты', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly screenshots: string[];

  @ApiProperty({ description: 'Цена', type: String, enum: ProjectPrice })
  @IsEnum(ProjectPrice)
  @IsOptional()
  readonly price: ProjectPrice;

  @ApiProperty({ description: 'Рейтинг', type: Number })
  @IsNumber()
  @IsOptional()
  readonly rating: number;

  @ApiProperty({ description: 'Ключевое слово', type: String })
  @IsString()
  @IsOptional()
  readonly slug: string;

  @ApiProperty({ description: 'Создатель', type: String })
  @IsString()
  @IsOptional()
  readonly creator: string;

  @ApiProperty({ description: 'Команда', type: String })
  @IsString()
  @IsOptional()
  readonly team: string;

  @ApiProperty({ description: 'Теги', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly tags: string[];
}
