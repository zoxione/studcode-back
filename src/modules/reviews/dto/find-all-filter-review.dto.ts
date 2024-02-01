import { IsOptional, IsString } from 'class-validator';
import { FindAllFilterDto } from '../../../common/dto/find-all-filter.dto';

export class FindAllFilterReviewDto extends FindAllFilterDto {
  @IsString()
  @IsOptional()
  readonly project_id?: string;
}
