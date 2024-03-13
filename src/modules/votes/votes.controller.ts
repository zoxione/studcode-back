import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { CreateVoteDto } from './dto/create-vote.dto';
import { FindAllFilterVoteDto } from './dto/find-all-filter-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { Vote } from './schemas/vote.schema';
import { FindAllReturnVote } from './types/find-all-return-vote';
import { VotesService } from './votes.service';

@ApiBearerAuth()
@ApiTags('votes')
@Controller({ path: 'votes', version: '1' })
export class VotesController {
  constructor(private readonly votesService: VotesService) {}
}
