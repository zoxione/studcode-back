import { IsOptional, IsString } from 'class-validator';
import { FindAllQueryDto } from 'src/common/dto/find-all-query.dto';

export class FindAllQueryProjectDto extends FindAllQueryDto {
  @IsString()
  @IsOptional()
  readonly tag_slug?: string;

  @IsString()
  @IsOptional()
  readonly creator_id?: string;
}
