import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class ProjectLinksDto {
  @ApiProperty({ description: 'Основная ссылка', type: String })
  @IsString()
  @IsUrl()
  @IsOptional()
  readonly main: string;

  @ApiProperty({ description: 'Ссылка на GitHub', type: String })
  @IsString()
  @IsUrl()
  @IsOptional()
  readonly github: string;

  @ApiProperty({ description: 'Ссылка на демо', type: String })
  @IsString()
  @IsUrl()
  @IsOptional()
  readonly demo: string;
}
