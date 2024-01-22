import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { FindAllReturnDto } from '../../common/dto/find-all-return.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamsService } from './teams.service';
import { Team } from './schemas/team.schema';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  async findAll(@Query() query: FindAllQueryDto): Promise<FindAllReturnDto> {
    return this.teamsService.findAll(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Получение команды по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOneById(@Param('id') id: string): Promise<Team> {
    return this.teamsService.findOne('_id', id);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:id')
  @ApiOperation({ summary: 'Обновление команды по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async updateOneById(@Param('id') id: string, @Body() updateDto: UpdateTeamDto): Promise<Team> {
    return this.teamsService.updateOne('_id', id, updateDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  @ApiOperation({ summary: 'Удаление команды по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async deleteOneById(@Param('id') id: string): Promise<Team> {
    return this.teamsService.deleteOne('_id', id);
  }
}
