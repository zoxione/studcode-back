import { IsString, IsInt, IsArray, IsUrl } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly description: string;

  @IsInt()
  readonly flames: number;

  @IsString()
  @IsUrl()
  readonly link: string;

  @IsString()
  @IsUrl()
  readonly avatar: string;

  @IsArray()
  @IsString({ each: true })
  readonly screenshots: string[];

  @IsArray()
  @IsString({ each: true })
  readonly tags: string[];
}
