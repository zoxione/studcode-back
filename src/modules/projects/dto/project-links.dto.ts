import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';

export class ProjectLinksDto {
  @ApiProperty({ description: 'Основная ссылка', type: String })
  @IsUrl()
  @IsOptional()
  readonly main: string;

  @ApiProperty({ description: 'Ссылка на GitHub', type: String })
  @IsUrl()
  @IsOptional()
  readonly github: string;

  @ApiProperty({ description: 'Ссылка на демо', type: String })
  @IsUrl()
  @IsOptional()
  readonly demo: string;
}
