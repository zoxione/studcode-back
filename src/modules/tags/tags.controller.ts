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

  @Get('/popular')
  @ApiOperation({ summary: 'Получение списка популярных тегов' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Tag })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAllPopular(): Promise<Tag[]> {
    return this.tagsService.findAllPopular();
  }

  @Get('/:key')
  @ApiOperation({ summary: 'Получение тега по ID/slug' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Tag })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOneById(@Param('key') key: string): Promise<Tag> {
    let foundTag = await this.tagsService.findOne('_id', key, { throw: false });
    if (!foundTag) {
      foundTag = await this.tagsService.findOne('slug', key, { throw: true });
    }
    return foundTag;
  }

  // @UseGuards(AccessTokenGuard)
  // @Put('/:key')
  // @ApiOperation({ summary: 'Обновление тега по ID/slug' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Tag })
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  // @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  // async updateOneById(@Param('key') key: string, @Body() updateDto: UpdateTagDto): Promise<Tag> {
  //   let updatedTag = await this.tagsService.updateOne('_id', key, updateDto, { throw: false });
  //   if (!updatedTag) {
  //     updatedTag = await this.tagsService.updateOne('slug', key, updateDto, { throw: true });
  //   }
  //   return updatedTag;
  // }

  // @UseGuards(AccessTokenGuard)
  // @Delete('/:key')
  // @ApiOperation({ summary: 'Удаление тега по ID/slug' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Tag })
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  // @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  // async deleteOneById(@Param('key') key: string): Promise<Tag> {
  //   let deletedTag = await this.tagsService.deleteOne('_id', key, { throw: false });
  //   if (!deletedTag) {
  //     deletedTag = await this.tagsService.deleteOne('slug', key, { throw: true });
  //   }
  //   return deletedTag;
  // }
}
