import { Type } from 'class-transformer';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class FindAllQueryDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  readonly page?: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  readonly limit?: number;

  @IsString()
  @IsOptional()
  readonly search?: string;
}
