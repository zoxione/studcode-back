import { Controller, Get, Headers, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller({ path: '', version: '' })
export class AppController {
  constructor() {}

  @Get('/')
  @ApiOperation({ summary: 'Основная информация' })
  async mainInfo(@Req() req: any): Promise<object> {
    const protocol = req.protocol;
    const host = req.get('Host');
    const fullUrl = `${protocol}://${host}`;
    return {
      swagger: `${fullUrl}/swagger`,
      docs: `${fullUrl}/docs`,
      projects: `${fullUrl}/api/v1/projects`,
      tags: `${fullUrl}/api/v1/tags`,
      votes: `${fullUrl}/api/v1/votes`,
      users: `${fullUrl}/api/v1/users`,
      teams: `${fullUrl}/api/v1/teams`,
      reviews: `${fullUrl}/api/v1/reviews`,
      reactions: `${fullUrl}/api/v1/reactions`,
    };
  }
}
