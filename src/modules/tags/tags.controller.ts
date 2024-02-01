import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { FindAllFilterTagDto } from './dto/find-all-filter-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './schemas/tag.schema';
import { TagsService } from './tags.service';
import { FindAllReturnTag } from './types/find-all-return-tag';

@ApiBearerAuth()
@ApiTags('tags')
@Controller({ path: 'tags', version: '1' })
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/')
  @ApiOperation({ summary: 'Создание нового тега' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Tag })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async createOne(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagsService.createOne(createTagDto);
  }

  @Get('/')
  @ApiOperation({ summary: 'Получение списка тегов' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Tag })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(@Query() query: FindAllFilterTagDto): Promise<FindAllReturnTag> {
    return this.tagsService.findAll(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Получение тега по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Tag })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOneById(@Param('id') id: string): Promise<Tag> {
    return this.tagsService.findOne('_id', id);
  }

  @Get('/slug/:slug')
  @ApiOperation({ summary: 'Получение тега по slug' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Tag })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOneBySlug(@Param('slug') slug: string): Promise<Tag> {
    return this.tagsService.findOne('slug', slug);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:id')
  @ApiOperation({ summary: 'Обновление тега по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Tag })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async updateOneById(@Param('id') id: string, @Body() updateDto: UpdateTagDto): Promise<Tag> {
    return this.tagsService.updateOne('_id', id, updateDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  @ApiOperation({ summary: 'Удаление тега по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Tag })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async deleteOneById(@Param('id') id: string): Promise<Tag> {
    return this.tagsService.deleteOne('_id', id);
  }
}
