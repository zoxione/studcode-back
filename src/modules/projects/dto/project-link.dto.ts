import { IsOptional, IsString, IsUrl } from 'class-validator';

export class ProjectLinkDto {
  @IsString()
  @IsUrl()
  @IsOptional()
  readonly main: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  readonly github: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  readonly demo: string;
}
