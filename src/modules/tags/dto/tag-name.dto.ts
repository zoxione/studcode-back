import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TagNameDto {
  @ApiProperty({ description: 'Название на английском', type: String })
  @IsString()
  readonly en: string;

  @ApiProperty({ description: 'Название на русском', type: String })
  @IsString()
  readonly ru: string;
}
