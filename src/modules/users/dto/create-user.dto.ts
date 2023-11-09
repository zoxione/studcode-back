import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsObject, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { UserNameDto } from './user-name.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/types/role';

export class CreateUserDto {
  @ApiProperty({ description: 'User identifier', example: 'john_doe' })
  @IsString()
  readonly username: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  readonly password: string;

  @ApiProperty({ description: 'User role (optional)', enum: Role, example: Role.User })
  @IsEnum(Role)
  @IsOptional()
  readonly role: string;

  @ApiProperty({ description: 'Refresh token (optional)' })
  @IsString()
  @IsOptional()
  readonly refresh_token: string;

  @ApiProperty({ description: 'User name (optional)' })
  @IsObject()
  @ValidateNested()
  @Type(() => UserNameDto)
  @IsOptional()
  readonly name: UserNameDto;

  @ApiProperty({ description: 'User avatar URL (optional)' })
  @IsString()
  @IsUrl()
  @IsOptional()
  readonly avatar: string;

  @ApiProperty({ description: 'Information about the user (optional)' })
  @IsString()
  @IsOptional()
  readonly about: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly projects: string[];
}
