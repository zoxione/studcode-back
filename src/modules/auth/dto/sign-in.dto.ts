import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ description: 'Электронная почта', type: String })
  @IsString()
  readonly email: string;

  @ApiProperty({ description: 'Пароль', type: String })
  @IsString()
  readonly password: string;
}
