import { IsOptional, IsString } from 'class-validator';
import { FindAllFilterDto } from '../../../common/dto/find-all-filter.dto';

export class FindAllFilterReactionDto extends FindAllFilterDto {
  @IsString()
  @IsOptional()
  readonly review_id?: string;
}
