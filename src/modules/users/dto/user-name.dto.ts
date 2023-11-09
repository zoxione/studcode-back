import { IsString } from 'class-validator';

export class UserNameDto {
  @IsString()
  readonly last: string;

  @IsString()
  readonly first: string;

  @IsString()
  readonly middle: string;
}
