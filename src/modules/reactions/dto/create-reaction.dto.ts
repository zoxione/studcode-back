import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReactionType } from '../types/reaction-type';

export class CreateReactionDto {
  @ApiProperty({ description: 'Тип', type: String, enum: ReactionType })
  @IsEnum(ReactionType)
  @IsOptional()
  readonly type: ReactionType;

  @ApiProperty({ description: 'Пользователь', type: String })
  @IsString()
  @IsOptional()
  readonly reacted_by: string;

  @ApiProperty({ description: 'Обзор', type: String })
  @IsString()
  @IsOptional()
  readonly review: string;
}
