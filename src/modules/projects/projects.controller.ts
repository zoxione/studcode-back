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

@ApiBearerAuth()
@ApiTags('projects')
@Controller({ path: 'projects', version: '1' })
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/')
  @ApiOperation({ summary: 'Создание нового проекта' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Project })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async createOne(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectsService.createOne(createProjectDto);
  }

  @Get('/')
  @ApiOperation({ summary: 'Получение списка проектов' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Project })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(@Query() query: FindAllFilterProjectDto): Promise<FindAllReturnProject> {
    return this.projectsService.findAll(query);
  }

  @Get('/:key')
  @ApiOperation({ summary: 'Получение проекта по ID/slug' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Project })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOneById(@Param('key') key: string): Promise<Project> {
    let foundProject = await this.projectsService.findOne('_id', key, { throw: false });
    if (!foundProject) {
      foundProject = await this.projectsService.findOne('slug', key, { throw: true });
    }
    return foundProject;
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:key')
  @ApiOperation({ summary: 'Обновление проекта по ID/slug' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Project })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async updateOneById(
    @Req() req: AuthUserRequest,
    @Param('key') key: string,
    @Body() updateDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.projectsService.findOne('_id', key);
    if (project.creator._id.toString() !== req.user.sub) {
      throw new UnauthorizedException('You are not allowed to update this project');
    }
    let updatedProject = await this.projectsService.updateOne('_id', key, updateDto, { throw: false });
    if (!updatedProject) {
      updatedProject = await this.projectsService.updateOne('slug', key, updateDto, { throw: true });
    }
    return updatedProject;
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:key/uploads')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo_file', maxCount: 1 },
      { name: 'screenshots_files', maxCount: 10 },
    ]),
  )
  @ApiOperation({ summary: 'Загрузка файлов проекта' })
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
  ): Promise<Project> {
    let project = await this.projectsService.findOne('_id', key);
    if (project.creator._id.toString() !== req.user.sub) {
      throw new UnauthorizedException('You are not allowed to upload files this project');
    }
    if (files.length > 0) {
      project = await this.projectsService.uploadFiles(project._id, files);
    }
    return project;
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:key/vote')
  @ApiOperation({ summary: 'Голосование за проект по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Project })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async voteOneById(@Param('key') key: string, @Req() req: AuthUserRequest): Promise<Project> {
    return this.projectsService.voteOne('_id', key, req.user.sub);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:key')
  @ApiOperation({ summary: 'Удаление проекта по ID/slug' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Project })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async deleteOneById(@Req() req: AuthUserRequest, @Param('key') key: string): Promise<Project> {
    const project = await this.projectsService.findOne('_id', key);
    if (project.creator._id.toString() !== req.user.sub) {
      throw new UnauthorizedException('You are not allowed to update this project');
    }
    let deletedProject = await this.projectsService.deleteOne('_id', key, { throw: false });
    if (!deletedProject) {
      deletedProject = await this.projectsService.deleteOne('slug', key, { throw: true });
    }
    return deletedProject;
  }
}
