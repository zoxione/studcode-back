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
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { ParseFilesPipe } from '../../common/validation/parse-files-pipe';
import { AuthUserRequest } from '../auth/types/auth-user-request';
import { CreateProjectDto } from './dto/create-project.dto';
import { FindAllFilterProjectDto } from './dto/find-all-filter-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';
import { Project } from './schemas/project.schema';
import { FindAllReturnProject } from './types/find-all-return-project';
import { ProjectFiles } from './types/project-files';
import { ReturnProject } from './types/return-project';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from '../auth/types/jwt-payload';
import configuration from '../../config/configuration';

@ApiBearerAuth()
@ApiTags('projects')
@Controller({ path: 'projects', version: '1' })
export class ProjectsController {
  private readonly fields: (keyof Project)[] = ['_id', 'slug'];

  constructor(
    private readonly projectsService: ProjectsService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post('/')
  @ApiOperation({ summary: 'Создание нового проекта' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Project })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async createOne(@Body() createProjectDto: CreateProjectDto): Promise<ReturnProject> {
    return this.projectsService.createOne(createProjectDto);
  }

  @Get('/')
  @ApiOperation({ summary: 'Получение списка проектов' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Project })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(@Req() req: Request, @Query() query: FindAllFilterProjectDto): Promise<FindAllReturnProject> {
    const access_token_name = configuration().access_token_name;
    const access_token_decode = req.cookies[access_token_name]
      ? (this.jwtService.decode(req.cookies[access_token_name]) as JwtPayload)
      : null;
    return this.projectsService.findAll({ ...query, user_id: access_token_decode?.sub });
  }

  @Get('/:key')
  @ApiOperation({ summary: `Получение проекта по _id/slug` })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Project })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOne(@Req() req: Request, @Param('key') key: string): Promise<ReturnProject> {
    const access_token_name = configuration().access_token_name;
    const access_token_decode = req.cookies[access_token_name]
      ? (this.jwtService.decode(req.cookies[access_token_name]) as JwtPayload)
      : null;
    return this.projectsService.findOne({ fields: this.fields, fieldValue: key, user_id: access_token_decode?.sub });
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:key')
  @ApiOperation({ summary: 'Обновление проекта по _id/slug' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Project })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async updateOne(@Req() req: AuthUserRequest, @Param('key') key: string, @Body() updateDto: UpdateProjectDto): Promise<ReturnProject> {
    const project = await this.projectsService.findOne({ fields: this.fields, fieldValue: key });
    if (project.creator._id.toString() !== req.user?.sub) {
      throw new UnauthorizedException('You are not allowed to update this project');
    }
    return this.projectsService.updateOne({
      fields: this.fields,
      fieldValue: key,
      user_id: req.user?.sub,
      updateDto: updateDto,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:key')
  @ApiOperation({ summary: 'Удаление проекта по _id/slug' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Project })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async deleteOne(@Req() req: AuthUserRequest, @Param('key') key: string): Promise<ReturnProject> {
    const project = await this.projectsService.findOne({ fields: this.fields, fieldValue: key });
    if (project.creator._id.toString() !== req.user?.sub) {
      throw new UnauthorizedException('You are not allowed to delete this project');
    }
    return this.projectsService.deleteOne({ fields: this.fields, fieldValue: key });
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:key/uploads')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo_file', maxCount: 1 },
      { name: 'screenshots_files', maxCount: 10 },
    ]),
  )
  @ApiOperation({ summary: 'Загрузка файлов проекта по _id/slug' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Project })
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
    files: ProjectFiles,
  ): Promise<ReturnProject> {
    let project = await this.projectsService.findOne({ fields: this.fields, fieldValue: key });
    if (project.creator._id.toString() !== req.user?.sub) {
      throw new UnauthorizedException('You are not allowed to upload file this project');
    }
    if (files.length > 0) {
      project = await this.projectsService.uploadFiles({
        fields: this.fields,
        fieldValue: key,
        user_id: req.user?.sub,
        files: files,
      });
    }
    return project;
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:key/vote')
  @ApiOperation({ summary: 'Голосование за проект по _id/slug' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Project })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async voteOne(@Param('key') key: string, @Req() req: AuthUserRequest): Promise<ReturnProject> {
    return this.projectsService.voteOne({ fields: this.fields, fieldValue: key, voter_id: req.user?.sub });
  }
}
