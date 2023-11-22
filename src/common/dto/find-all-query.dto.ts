import { Type } from 'class-transformer';
import { IsString, IsInt, IsOptional, IsEnum } from 'class-validator';
import { TimeFrame } from '../types/time-frame';

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

  @IsEnum(TimeFrame)
  @IsOptional()
  readonly time_frame?: string;
}
