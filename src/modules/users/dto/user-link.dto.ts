import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UserLinkDto {
  @IsString()
  @IsUrl()
  @IsOptional()
  readonly github: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  readonly vkontakte: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  readonly telegram: string;
}
