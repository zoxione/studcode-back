import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindAllFilterDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  readonly page?: number;

  @IsInt()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  readonly limit?: number;

  @IsString()
  @IsOptional()
  readonly search?: string;

  @IsString()
  @IsOptional()
  readonly order?: string;
}
