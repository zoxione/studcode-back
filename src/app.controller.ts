import { Controller, Get, Headers, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller({ path: '', version: '' })
export class AppController {
  constructor() {}

  @Get('/')
  mainInfo(@Req() req: any): object {
    const protocol = req.protocol;
    const host = req.get('Host');
    const fullUrl = `${protocol}://${host}`;
    return {
      theneo: 'https://app.theneo.io/3b98c227-149a-462f-9393-85f6290d6245/studcode-server',
      swagger: `${fullUrl}/swagger`,
      projects: `${fullUrl}/api/v1/projects`,
      tags: `${fullUrl}/api/v1/tags`,
      votes: `${fullUrl}/api/v1/votes`,
      users: `${fullUrl}/api/v1/users`,
      teams: `${fullUrl}/api/v1/teams`,
      awards: `${fullUrl}/api/v1/awards`,
      reviews: `${fullUrl}/api/v1/reviews`,
    };
  }
}
