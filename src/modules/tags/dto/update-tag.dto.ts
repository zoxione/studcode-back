import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { TagNameDto } from './tag-name.dto';

export class UpdateTagDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => TagNameDto)
  readonly name: TagNameDto;
}
