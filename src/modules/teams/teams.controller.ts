import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindAllFilterTeamDto } from './dto/find-all-filter-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './schemas/team.schema';
import { TeamsService } from './teams.service';
import { FindAllReturnTeam } from './types/find-all-return-team';

@ApiBearerAuth()
@ApiTags('teams')
@Controller({ path: 'teams', version: '1' })
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/')
  @ApiOperation({ summary: 'Создание новой команды' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async createOne(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamsService.createOne(createTeamDto);
  }

  @Get('/')
  @ApiOperation({ summary: 'Получение списка команд' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(@Query() query: FindAllFilterTeamDto): Promise<FindAllReturnTeam> {
    return this.teamsService.findAll(query);
  }

  @Get('/:key')
  @ApiOperation({ summary: 'Получение команды по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOneById(@Param('key') key: string): Promise<Team> {
    return this.teamsService.findOne('_id', key);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:key')
  @ApiOperation({ summary: 'Обновление команды по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async updateOneById(@Param('key') key: string, @Body() updateDto: UpdateTeamDto): Promise<Team> {
    return this.teamsService.updateOne('_id', key, updateDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:key')
  @ApiOperation({ summary: 'Удаление команды по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async deleteOneById(@Param('key') key: string): Promise<Team> {
    return this.teamsService.deleteOne('_id', key);
  }
}
