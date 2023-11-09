import { IsString } from 'class-validator';

export class TagNameDto {
  @IsString()
  readonly en: string;

  @IsString()
  readonly ru: string;
}
