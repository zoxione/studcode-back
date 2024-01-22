import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UserLinksDto {
  @ApiProperty({ description: 'Гитхаб', type: String })
  @IsString()
  @IsUrl()
  @IsOptional()
  readonly github: string;

  @ApiProperty({ description: 'Вконтакте', type: String })
  @IsString()
  @IsUrl()
  @IsOptional()
  readonly vkontakte: string;

  @ApiProperty({ description: 'Телеграм', type: String })
  @IsString()
  @IsUrl()
  @IsOptional()
  readonly telegram: string;
}
