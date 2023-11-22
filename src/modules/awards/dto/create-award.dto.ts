import { Type } from 'class-transformer';
import { IsDefined, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { AwardNameDto } from './award-name.dto';

export class CreateAwardDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => AwardNameDto)
  readonly name: AwardNameDto;

  @IsString()
  @IsUrl()
  @IsOptional()
  readonly icon: string;
}
