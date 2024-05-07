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
      name: 'Студенческий код',
      version: '1.3.0',
      swagger: `${fullUrl}/swagger`,
      docs: `${fullUrl}/docs`,
      projects: `${fullUrl}/api/v1/projects`,
      tags: `${fullUrl}/api/v1/tags`,
      users: `${fullUrl}/api/v1/users`,
      teams: `${fullUrl}/api/v1/teams`,
      reviews: `${fullUrl}/api/v1/reviews`,
      specializations: `${fullUrl}/api/v1/specializations`,
      educations: `${fullUrl}/api/v1/educations`,
    };
  }
}
