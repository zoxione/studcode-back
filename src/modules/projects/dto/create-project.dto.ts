import { IsString, IsInt, IsArray, IsUrl, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsInt()
  @IsOptional()
  readonly flames: number;

  @IsString()
  @IsUrl()
  @IsOptional()
  readonly link: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  readonly avatar: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly screenshots: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly tags: string[];
}
