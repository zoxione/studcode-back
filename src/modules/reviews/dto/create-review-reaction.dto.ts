import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ReviewReactionType } from '../types/review-reaction-type';

export class CreateReviewReactionDto {
  @ApiProperty({ description: 'Тип', type: String, enum: ReviewReactionType })
  @IsEnum(ReviewReactionType)
  readonly type: ReviewReactionType;

  @ApiProperty({ description: 'Пользователь', type: String })
  @IsString()
  readonly reacted_by: string;

  @ApiProperty({ description: 'Обзор', type: String })
  @IsString()
  readonly review: string;
}
