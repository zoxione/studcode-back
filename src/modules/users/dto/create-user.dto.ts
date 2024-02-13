import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Award } from '../../awards/schemas/award.schema';
import { Project } from '../../projects/schemas/project.schema';
import { Role } from '../types/role';
import { UserFullNameDto } from './user-full-name.dto';
import { UserLinksDto } from './user-links.dto';

export class CreateUserDto {
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

  @ApiProperty({ description: 'Подтверждение почты', type: Boolean })
  @IsBoolean()
  @IsOptional()
  readonly verify_email: boolean;

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
  @IsUrl()
  @IsOptional()
  readonly avatar: string;

  @ApiProperty({ description: 'О себе', type: String })
  @IsString()
  @IsOptional()
  readonly about: string;

  @ApiProperty({ description: 'Ссылки', type: UserLinksDto })
  @IsObject()
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
