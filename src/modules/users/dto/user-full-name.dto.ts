import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UserFullNameDto {
  @ApiProperty({ description: 'Фамилия', type: String })
  @IsString()
  readonly surname: string;

  @ApiProperty({ description: 'Имя', type: String })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Отчество', type: String })
  @IsString()
  @IsOptional()
  readonly patronymic: string;
}
