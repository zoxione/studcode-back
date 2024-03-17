import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ description: 'Токен', type: String })
  @IsString()
  @IsOptional()
  readonly token: string;
}
