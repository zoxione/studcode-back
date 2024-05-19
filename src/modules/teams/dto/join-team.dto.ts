import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class JoinTeamDto {
  @ApiProperty({ description: 'Токен', type: String })
  @IsString()
  @IsOptional()
  readonly token: string;
}
