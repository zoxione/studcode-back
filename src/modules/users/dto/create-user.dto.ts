import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsObject, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { LinkDto } from '../../../common/dto/link.dto';
import { UserRole } from '../types/user-role';
import { UserFullNameDto } from './user-full-name.dto';

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

  @ApiProperty({ description: 'Роль', type: String, enum: UserRole })
  @IsEnum(UserRole)
  @IsOptional()
  readonly role: UserRole;

  @ApiProperty({ description: 'Подтверждение почты', type: String })
  @IsString()
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

  @ApiProperty({ description: 'Ссылка на обложку', type: String })
  @IsUrl()
  @IsOptional()
  readonly cover: string;

  @ApiProperty({ description: 'О себе', type: String })
  @IsString()
  @IsOptional()
  readonly about: string;

  @ApiProperty({ description: 'Ссылки', type: [LinkDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  @IsOptional()
  readonly links: LinkDto[];

  @ApiProperty({ description: 'Специализации', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly specializations: string[];

  @ApiProperty({ description: 'Образовательное учреждение', type: String })
  @IsString()
  @IsOptional()
  readonly education: string;
}
