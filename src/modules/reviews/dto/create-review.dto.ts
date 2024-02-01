import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'Текст', type: String })
  @IsString()
  readonly text: string;

  @ApiProperty({ description: 'Текст', type: Number })
  @IsNumber()
  readonly rating: number;

  @ApiProperty({ description: 'Проект', type: String })
  @IsString()
  readonly project: string;

  @ApiProperty({ description: 'Рецензент', type: String })
  @IsString()
  readonly reviewer: string;

  @ApiProperty({ description: 'Пользователи, поставившие лайки', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly likes: string[];

  @ApiProperty({ description: 'Пользователи, поставившие дизлайки', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly dislikes: string[];
}
