import { Type } from 'class-transformer';
import { IsDefined, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { TagNameDto } from './tag-name.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTagDto {
  @ApiProperty({ description: 'Название', type: TagNameDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => TagNameDto)
  readonly name: TagNameDto;

  @ApiProperty({ description: 'Ссылка на иконку', type: String })
  @IsString()
  @IsUrl()
  @IsOptional()
  readonly icon: string;
}
