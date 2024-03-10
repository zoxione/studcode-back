import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FindAllFilterDto } from '../../../common/dto/find-all-filter.dto';
import { ProjectTimeFrame } from '../types/project-time-frame';

export class FindAllFilterProjectDto extends FindAllFilterDto {
  @IsEnum(ProjectTimeFrame)
  @IsOptional()
  readonly time_frame?: ProjectTimeFrame;

  @IsString()
  @IsOptional()
  readonly tag_slug?: string;

  @IsString()
  @IsOptional()
  readonly status?: string;

  @IsString()
  @IsOptional()
  readonly creator_id?: string;

  @IsString()
  @IsOptional()
  readonly team_id?: string;
}
