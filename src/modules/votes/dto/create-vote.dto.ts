import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateVoteDto {
  @ApiProperty({ description: 'Проект', type: String })
  @IsString()
  readonly project: string;

  @ApiProperty({ description: 'Голосующий', type: String })
  @IsString()
  readonly voter: string;
}
