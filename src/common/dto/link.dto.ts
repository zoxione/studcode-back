import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LinkType } from '../types/link-type';

export class LinkDto {
  @ApiProperty({ description: 'Тип', type: String, enum: LinkType })
  @IsEnum(LinkType)
  @IsOptional()
  readonly type: LinkType;

  @ApiProperty({ description: 'Метка', type: String })
  @IsString()
  @IsOptional()
  readonly label: string;

  @ApiProperty({ description: 'URL', type: String })
  @IsString()
  @IsOptional()
  readonly url: string;
}
