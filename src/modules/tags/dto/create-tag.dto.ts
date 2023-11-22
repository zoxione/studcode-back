import { Type } from 'class-transformer';
import { IsDefined, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { TagNameDto } from './tag-name.dto';

export class CreateTagDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => TagNameDto)
  readonly name: TagNameDto;

  @IsString()
  @IsUrl()
  @IsOptional()
  readonly icon: string;
}
