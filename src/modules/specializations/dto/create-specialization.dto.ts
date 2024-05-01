import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateSpecializationDto {
  @ApiProperty({ description: 'Название', type: String })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Описание', type: String })
  @IsString()
  @IsOptional()
  readonly description: string;
}
