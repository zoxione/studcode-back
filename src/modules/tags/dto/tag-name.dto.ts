import { IsOptional, IsString } from 'class-validator';

export class TagNameDto {
  @IsString()
  @IsOptional()
  readonly en: string;

  @IsString()
  @IsOptional()
  readonly ru: string;
}
