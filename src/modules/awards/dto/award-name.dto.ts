import { IsOptional, IsString } from 'class-validator';

export class AwardNameDto {
  @IsString()
  @IsOptional()
  readonly en: string;

  @IsString()
  @IsOptional()
  readonly ru: string;
}
