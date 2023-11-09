import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateTeamDto {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly about: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  readonly avatar: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly users: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly projects: string[];
}
