import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'Текст', type: String })
  @IsString()
  readonly text: string;

  @ApiProperty({ description: 'Оценка', type: Number })
  @IsNumber()
  @IsOptional()
  readonly rating: number;

  @ApiProperty({ description: 'Количество лайков', type: Number })
  @IsNumber()
  @IsOptional()
  readonly likes: number;

  @ApiProperty({ description: 'Количество дизлайков', type: Number })
  @IsNumber()
  @IsOptional()
  readonly dislikes: number;

  @ApiProperty({ description: 'Проект', type: String })
  @IsString()
  readonly project: string;

  @ApiProperty({ description: 'Рецензент', type: String })
  @IsString()
  readonly reviewer: string;
}
