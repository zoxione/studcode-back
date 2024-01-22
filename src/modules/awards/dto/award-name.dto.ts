import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AwardNameDto {
  @ApiProperty({ description: 'Название на английском', type: String })
  @IsString()
  @IsOptional()
  readonly en: string;

  @ApiProperty({ description: 'Название на русском', type: String })
  @IsString()
  @IsOptional()
  readonly ru: string;
}
