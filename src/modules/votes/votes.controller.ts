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

  @UseGuards(AccessTokenGuard)
  @Post('/')
  @ApiOperation({ summary: 'Создание нового голоса' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Vote })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async createOne(@Body() createVoteDto: CreateVoteDto): Promise<Vote> {
    return this.votesService.createOne(createVoteDto);
  }

  @Get('/')
  @ApiOperation({ summary: 'Получение списка голосов' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Vote })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(@Query() query: FindAllFilterVoteDto): Promise<FindAllReturnVote> {
    return this.votesService.findAll(query);
  }

  @Get('/:key')
  @ApiOperation({ summary: 'Получение голоса по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Vote })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOneById(@Param('key') key: string): Promise<Vote> {
    return this.votesService.findOne('_id', key);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:key')
  @ApiOperation({ summary: 'Обновление голоса по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Vote })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async updateOneById(@Param('key') key: string, @Body() updateDto: UpdateVoteDto): Promise<Vote> {
    return this.votesService.updateOne('_id', key, updateDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:key')
  @ApiOperation({ summary: 'Удаление голоса по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Vote })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async deleteOneById(@Param('key') key: string): Promise<Vote> {
    return this.votesService.deleteOne('_id', key);
  }
}
