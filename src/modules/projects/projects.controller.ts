import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { FindAllReturnDto } from '../../common/dto/find-all-return.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
import { Project } from './schemas/project.schema';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
  async findAll(@Query() query: FindAllQueryDto): Promise<FindAllReturnDto> {
    return this.projectsService.findAll(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Получение проекта по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Project })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOneById(@Param('id') id: string): Promise<Project> {
    return this.projectsService.findOne('_id', id);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:id')
  @ApiOperation({ summary: 'Обновление проекта по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Project })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async updateOneById(@Param('id') id: string, @Body() updateDto: UpdateProjectDto): Promise<Project> {
    return this.projectsService.updateOne('_id', id, updateDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  @ApiOperation({ summary: 'Удаление проекта по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Project })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async deleteOneById(@Param('id') id: string): Promise<Project> {
    return this.projectsService.deleteOne('_id', id);
  }
}
