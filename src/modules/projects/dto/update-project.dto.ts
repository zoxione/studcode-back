import { IsString, IsInt, IsArray, IsUrl, IsOptional, IsEnum, ValidateNested, IsDefined } from 'class-validator';
import { ProjectStatus } from '../../../common/types/project-status';
import { ProjectLinkDto } from './project-link.dto';
import { Type } from 'class-transformer';
import { ProjectPrice } from '../../../common/types/project-price';

export class UpdateProjectDto {
  @IsString()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly tagline: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  readonly status: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsInt()
  @IsOptional()
  readonly flames: number;

  @IsDefined()
  @ValidateNested()
  @Type(() => ProjectLinkDto)
  @IsOptional()
  readonly link: ProjectLinkDto;

  @IsString()
  @IsUrl()
  @IsOptional()
  readonly avatar: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly screenshots: string[];

  @IsEnum(ProjectPrice)
  @IsOptional()
  readonly price: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly tags: string[];

  @IsString()
  @IsOptional()
  readonly creator: string;
}
