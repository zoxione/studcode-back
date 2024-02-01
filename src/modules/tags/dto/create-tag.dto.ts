import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { TagNameDto } from './tag-name.dto';

export class CreateTagDto {
  @ApiProperty({ description: 'Название', type: TagNameDto })
  @IsObject()
  @ValidateNested()
  @Type(() => TagNameDto)
  readonly name: TagNameDto;

  @ApiProperty({ description: 'Ссылка на иконку', type: String })
  @IsUrl()
  @IsOptional()
  readonly icon: string;

  @ApiProperty({ description: 'Ключевое слово', type: String })
  @IsString()
  readonly slug: string;
}
