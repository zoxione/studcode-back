import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInReturnDto {
  @ApiProperty({ description: 'Токен авторизации', type: String })
  @IsString()
  readonly access_token: string;

  @ApiProperty({ description: 'Токен обновления', type: String })
  @IsString()
  readonly refresh_token: string;
}
