import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Model } from 'mongoose';
import configuration from '../../config/configuration';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { ParseFilesPipe } from '../../common/validation/parse-files-pipe';
import { AuthUserRequest } from '../auth/types/auth-user-request';
import { Token } from '../tokens/schemas/token.schema';
import { TokenEvent } from '../tokens/types/token-event';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindAllFilterTeamDto } from './dto/find-all-filter-team.dto';
import { FindOneFilterTeamDto } from './dto/find-one-filter-team.dto';
import { JoinTeamDto } from './dto/join-team.dto';
import { UpdateTeamMembersDto } from './dto/update-team-members.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './schemas/team.schema';
import { TeamsService } from './teams.service';
import { FindAllReturnTeam } from './types/find-all-return-team';
import { TeamFiles } from './types/team-files';
import { TeamStatus } from './types/team-status';

@ApiBearerAuth()
@ApiTags('teams')
@Controller({ path: 'teams', version: '1' })
export class TeamsController {
  private readonly fields: (keyof Team)[] = ['_id', 'name', 'slug'];

  constructor(
    private readonly teamsService: TeamsService,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

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
  @ApiOperation({ summary: 'Получение команды по _id/name' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOne(@Param('key') key: string, @Query() query: FindOneFilterTeamDto): Promise<Team> {
    return this.teamsService.findOne({ fields: this.fields, fieldValue: key, filter: query });
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:key')
  @ApiOperation({ summary: 'Обновление команды по _id/name' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async updateOne(@Req() req: AuthUserRequest, @Param('key') key: string, @Body() updateDto: UpdateTeamDto): Promise<Team> {
    const team = await this.teamsService.findOne({ fields: this.fields, fieldValue: key, filter: {} });
    if (!team.members.some((member) => member.user._id.toString() === req.user.sub && member.role === 'owner')) {
      throw new UnauthorizedException('You are not allowed to update this team');
    }
    return this.teamsService.updateOne({ fields: this.fields, fieldValue: key, updateDto: updateDto });
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:key')
  @ApiOperation({ summary: 'Удаление команды по _id/name' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async deleteOne(@Req() req: AuthUserRequest, @Param('key') key: string): Promise<Team> {
    const team = await this.teamsService.findOne({ fields: this.fields, fieldValue: key, filter: {} });
    if (!team.members.some((member) => member.user._id.toString() === req.user.sub && member.role === 'owner')) {
      throw new UnauthorizedException('You are not allowed to update this team');
    }
    return this.teamsService.deleteOne({ fields: this.fields, fieldValue: key });
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:key/uploads')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'logo_file', maxCount: 1 }]))
  @ApiOperation({ summary: 'Загрузка файлов команды по _id/name' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async uploadFiles(
    @Req() req: AuthUserRequest,
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
    let team = await this.teamsService.findOne({ fields: this.fields, fieldValue: key, filter: {} });
    if (!team.members.some((member) => member.user._id.toString() === req.user.sub && member.role === 'owner')) {
      throw new UnauthorizedException('You are not allowed to update this team');
    }
    if (files.length > 0) {
      team = await this.teamsService.uploadFiles({ fields: this.fields, fieldValue: key, files: files });
    }
    return team;
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:key/members')
  @ApiOperation({ summary: 'Обновление участников команды по _id/name' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async updateMembers(
    @Req() req: AuthUserRequest,
    @Param('key') key: string,
    @Body() updateMembersDto: UpdateTeamMembersDto,
  ): Promise<Team> {
    const team = await this.teamsService.findOne({ fields: this.fields, fieldValue: key, filter: {} });
    if (!team.members.some((member) => member.user._id.toString() === req.user.sub && member.role === 'owner')) {
      throw new UnauthorizedException(`You are not allowed to update members this team because you aren't owner`);
    }
    return this.teamsService.updateMembers({
      fields: this.fields,
      fieldValue: key,
      updateMembersDto: updateMembersDto,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get('/:key/members/join')
  @ApiOperation({ summary: 'Вступление участника в команду по _id/name' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async join(@Req() req: AuthUserRequest, @Param('key') key: string): Promise<Team> {
    const team = await this.teamsService.findOne({ fields: this.fields, fieldValue: key, filter: {} });
    if (team.status === TeamStatus.Closed) {
      throw new ForbiddenException('This team is closed');
    }
    return this.teamsService.join({
      fields: this.fields,
      fieldValue: key,
      userId: req.user.sub,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Get('/:key/members/accept')
  @ApiOperation({ summary: 'Принятие участника в команду по _id/name' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async accept(@Req() req: AuthUserRequest, @Param('key') key: string, @Query() query: JoinTeamDto, @Res() res: Response): Promise<any> {
    const team = await this.teamsService.findOne({ fields: this.fields, fieldValue: key, filter: {} });
    if (query.token) {
      const token = await this.tokenModel.findOne({ content: query.token, event: TokenEvent.TeamInvite, user: req.user.sub });
      if (!token) {
        throw new UnauthorizedException('Invalid token');
      } else {
        await this.teamsService.join({
          fields: this.fields,
          fieldValue: key,
          userId: req.user.sub,
        });
        return res.redirect(`${configuration().frontend_url}/teams/${team.slug}`);
      }
    } else {
      throw new ForbiddenException('Token is required');
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get('/:key/members/leave')
  @ApiOperation({ summary: 'Покидание участника из команды по _id/name' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Team })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async leave(@Req() req: AuthUserRequest, @Param('key') key: string): Promise<Team> {
    return this.teamsService.leave({
      fields: this.fields,
      fieldValue: key,
      userId: req.user.sub,
    });
  }
}
