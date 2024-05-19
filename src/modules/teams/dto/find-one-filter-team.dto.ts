import { IsOptional, IsString } from 'class-validator';

export class FindOneFilterTeamDto {
  @IsString()
  @IsOptional()
  readonly member_role?: string;
}
