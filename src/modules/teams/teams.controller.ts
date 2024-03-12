import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindAllFilterTeamDto } from './dto/find-all-filter-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './schemas/team.schema';
import { TeamsService } from './teams.service';
import { FindAllReturnTeam } from './types/find-all-return-team';
import { UpdateMembersTeamDto } from './dto/update-members-team.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ParseFilesPipe } from '../../common/validation/parse-files-pipe';
import { TeamFiles } from './types/team-files';

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
  @ApiOperation({ summary: 'Получение команды по ID/name' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOneById(@Param('key') key: string): Promise<Team> {
    let foundTeam = await this.teamsService.findOne('_id', key, { throw: false });
    if (!foundTeam) {
      foundTeam = await this.teamsService.findOne('name', key, { throw: false });
    }
    if (!foundTeam) {
      foundTeam = await this.teamsService.findOne('slug', key, { throw: true });
    }
    return foundTeam;
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:key')
  @ApiOperation({ summary: 'Обновление команды по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async updateOneById(@Param('key') key: string, @Body() updateDto: UpdateTeamDto): Promise<Team> {
    let updatedTeam = await this.teamsService.updateOne('_id', key, updateDto, { throw: false });
    if (!updatedTeam) {
      updatedTeam = await this.teamsService.updateOne('name', key, updateDto, { throw: false });
    }
    if (!updatedTeam) {
      updatedTeam = await this.teamsService.updateOne('slug', key, updateDto, { throw: true });
    }
    return updatedTeam;
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:key')
  @ApiOperation({ summary: 'Удаление команды по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async deleteOneById(@Param('key') key: string): Promise<Team> {
    let deletedTeam = await this.teamsService.deleteOne('_id', key, { throw: false });
    if (!deletedTeam) {
      deletedTeam = await this.teamsService.deleteOne('name', key, { throw: false });
    }
    if (!deletedTeam) {
      deletedTeam = await this.teamsService.deleteOne('slug', key, { throw: true });
    }
    return deletedTeam;
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:key/members')
  @ApiOperation({ summary: 'Обновление участников команды по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async updateMembers(@Param('key') key: string, @Body() updateDto: UpdateMembersTeamDto): Promise<Team> {
    let updatedTeam = await this.teamsService.updateMembersOne('_id', key, updateDto, { throw: false });
    if (!updatedTeam) {
      updatedTeam = await this.teamsService.updateMembersOne('name', key, updateDto, { throw: false });
    }
    if (!updatedTeam) {
      updatedTeam = await this.teamsService.updateMembersOne('slug', key, updateDto, { throw: true });
    }
    return updatedTeam;
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:key/uploads')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'logo_file', maxCount: 1 }]))
  @ApiOperation({ summary: 'Загрузка файлов команды' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async uploadFiles(
    @Param('key') key: string,
    @UploadedFiles(
      new ParseFilesPipe(
        new ParseFilePipeBuilder()
          .addFileTypeValidator({
            fileType: /(jpeg|jpg|png|webp)$/,
          })
          .addMaxSizeValidator({
            maxSize: 5 * 1024 * 1024, // 5 MB in bytes
          })
          .build({
            fileIsRequired: false,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          }),
      ),
    )
    files: TeamFiles,
  ): Promise<Team> {
    let team = await this.teamsService.findOne('_id', key);
    if (files.length > 0) {
      team = await this.teamsService.uploadFiles(team._id, files);
    }
    return team;
  }
}
