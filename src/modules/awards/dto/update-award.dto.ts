import { Type } from 'class-transformer';
import { IsDefined, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { AwardNameDto } from './award-name.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAwardDto {
  @ApiProperty({ description: 'Название', type: AwardNameDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => AwardNameDto)
  readonly name: AwardNameDto;

  @ApiProperty({ description: 'Ссылка на иконку', type: String })
  @IsString()
  @IsUrl()
  @IsOptional()
  readonly icon: string;
}
