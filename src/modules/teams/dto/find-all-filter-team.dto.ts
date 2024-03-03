import { IsOptional, IsString } from 'class-validator';
import { FindAllFilterDto } from '../../../common/dto/find-all-filter.dto';

export class FindAllFilterTeamDto extends FindAllFilterDto {
  @IsString()
  @IsOptional()
  readonly member_id?: string;
}
