import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { FindAllReturnDto } from '../../common/dto/find-all-return.dto';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './schemas/tag.schema';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
  async findAll(@Query() query: FindAllQueryDto): Promise<FindAllReturnDto> {
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
