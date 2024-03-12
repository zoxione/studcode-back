import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReactionsService } from './reactions.service';

@ApiBearerAuth()
@ApiTags('reactions')
@Controller({ path: 'reactions', version: '1' })
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}
}
