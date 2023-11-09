import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateTeamDto {
  @IsString()
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
  readonly users: string[];

  @IsArray()
  @IsString({ each: true })
  readonly projects: string[];
}
