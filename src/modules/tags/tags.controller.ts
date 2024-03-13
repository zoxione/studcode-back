import { Body, Controller, Get, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { FindAllFilterTagDto } from './dto/find-all-filter-tag.dto';
import { Tag } from './schemas/tag.schema';
import { TagsService } from './tags.service';
import { FindAllReturnTag } from './types/find-all-return-tag';

@ApiBearerAuth()
@ApiTags('tags')
@Controller({ path: 'tags', version: '1' })
export class TagsController {
  private readonly fields: (keyof Tag)[] = ['_id', 'slug'];

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
  @ApiOperation({ summary: 'Получение тега по _id/slug' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Tag })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOne(@Param('key') key: string): Promise<Tag> {
    return this.tagsService.findOne({ fields: this.fields, fieldValue: key });
  }
}
