import { IsString } from 'class-validator';

export class SignInReturnDto {
  @IsString()
  readonly access_token: string;

  @IsString()
  readonly refresh_token: string;
}
