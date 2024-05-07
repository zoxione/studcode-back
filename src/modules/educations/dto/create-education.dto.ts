import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({ description: 'Аббревиатура', type: String })
  @IsString()
  readonly abbreviation: string;

  @ApiProperty({ description: 'Название', type: String })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Описание', type: String })
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({ description: 'Ссылка на логотип', type: String })
  @IsString()
  @IsOptional()
  readonly logo: string;
}
