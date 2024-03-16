import { IsOptional, IsString } from 'class-validator';
import { FindAllFilterDto } from '../../../common/dto/find-all-filter.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllFilterReviewDto extends FindAllFilterDto {
  @ApiProperty({ description: 'Идентификатор проекта', type: String })
  @IsString()
  @IsOptional()
  readonly project_id?: string;

  @ApiProperty({ description: 'Идентификатор пользователя', type: String })
  @IsString()
  @IsOptional()
  readonly user_id: string;
}
