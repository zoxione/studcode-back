import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TokensService } from './tokens.service';

@ApiBearerAuth()
@ApiTags('tokens')
@Controller({ path: 'tokens', version: '1' })
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}
}
