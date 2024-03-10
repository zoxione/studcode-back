import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: 'Название', type: String })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Ссылка на иконку', type: String })
  @IsString()
  @IsOptional()
  readonly icon: string;

  @ApiProperty({ description: 'Описание', type: String })
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({ description: 'Ключевое слово', type: String })
  @IsString()
  @IsOptional()
  readonly slug: string;
}
