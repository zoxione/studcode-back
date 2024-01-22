import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { UserFullNameDto } from './user-full-name.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../types/role';
import { UserLinksDto } from './user-links.dto';
import { Award } from '../../awards/schemas/award.schema';
import { Project } from '../../projects/schemas/project.schema';

export class UpdateUserDto {
  @ApiProperty({ description: 'Имя пользователя', type: String })
  @IsString()
  readonly username: string;

  @ApiProperty({ description: 'Электронная почта', type: String })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'Пароль', type: String })
  @IsString()
  readonly password: string;

  @ApiProperty({ description: 'Роль', type: String, enum: Role })
  @IsEnum(Role)
  @IsOptional()
  readonly role: string;

  @ApiProperty({ description: 'Токен обновления', type: String })
  @IsString()
  @IsOptional()
  readonly refresh_token: string;

  @ApiProperty({ description: 'ФИО', type: UserFullNameDto })
  @IsObject()
  @ValidateNested()
  @Type(() => UserFullNameDto)
  @IsOptional()
  readonly full_name: UserFullNameDto;

  @ApiProperty({ description: 'Ссылка на аватар', type: String })
  @IsString()
  @IsUrl()
  @IsOptional()
  readonly avatar: string;

  @ApiProperty({ description: 'О себе', type: String })
  @IsString()
  @IsOptional()
  readonly about: string;

  @ApiProperty({ description: 'Ссылки', type: UserLinksDto })
  @IsDefined()
  @ValidateNested()
  @Type(() => UserLinksDto)
  @IsOptional()
  readonly links: UserLinksDto;

  @ApiProperty({ description: 'Награды', type: [Award] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly awards: string[];

  @ApiProperty({ description: 'Проекты', type: [Project] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly projects: string[];
}
