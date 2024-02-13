import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { AwardNameDto } from './award-name.dto';

export class CreateAwardDto {
  @ApiProperty({ description: 'Название', type: AwardNameDto })
  @IsObject()
  @ValidateNested()
  @Type(() => AwardNameDto)
  readonly name: AwardNameDto;

  @ApiProperty({ description: 'Ссылка на иконку', type: String })
  @IsUrl()
  @IsOptional()
  readonly icon: string;

  @ApiProperty({ description: 'Описание', type: String })
  @IsString()
  @IsOptional()
  readonly description: string;
}
