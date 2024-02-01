import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUrl } from 'class-validator';

export class UserLinksDto {
  @ApiProperty({ description: 'Гитхаб', type: String })
  @IsUrl()
  @IsOptional()
  readonly github: string;

  @ApiProperty({ description: 'Вконтакте', type: String })
  @IsUrl()
  @IsOptional()
  readonly vkontakte: string;

  @ApiProperty({ description: 'Телеграм', type: String })
  @IsUrl()
  @IsOptional()
  readonly telegram: string;
}
