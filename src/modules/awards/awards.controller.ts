import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { AwardsService } from './awards.service';
import { CreateAwardDto } from './dto/create-award.dto';
import { FindAllFilterAwardDto } from './dto/find-all-filter-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';
import { Award } from './schemas/award.schema';
import { FindAllReturnAward } from './types/find-all-return-award';

@ApiBearerAuth()
@ApiTags('awards')
@Controller({ path: 'awards', version: '1' })
export class AwardsController {
  constructor(private readonly awardsService: AwardsService) {}

  // @UseGuards(AccessTokenGuard)
  // @Post('/')
  // @ApiOperation({ summary: 'Создание новой награды' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Award })
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  // async createOne(@Body() createAwardDto: CreateAwardDto): Promise<Award> {
  //   return this.awardsService.createOne(createAwardDto);
  // }

  // @Get('/')
  // @ApiOperation({ summary: 'Получение списка наград' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Award })
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  // async findAll(@Query() query: FindAllFilterAwardDto): Promise<FindAllReturnAward> {
  //   return this.awardsService.findAll(query);
  // }

  // @Get('/:key')
  // @ApiOperation({ summary: 'Получение награды по ID' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Award })
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  // @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  // async findOneById(@Param('key') key: string): Promise<Award> {
  //   return this.awardsService.findOne('_id', key);
  // }

  // @UseGuards(AccessTokenGuard)
  // @Put('/:key')
  // @ApiOperation({ summary: 'Обновление награды по ID' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Award })
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  // @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  // async updateOneById(@Param('key') key: string, @Body() updateDto: UpdateAwardDto): Promise<Award> {
  //   return this.awardsService.updateOne('_id', key, updateDto);
  // }

  // @UseGuards(AccessTokenGuard)
  // @Delete('/:key')
  // @ApiOperation({ summary: 'Удаление награды по ID' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Award })
  // @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  // @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  // async deleteOneById(@Param('key') key: string): Promise<Award> {
  //   return this.awardsService.deleteOne('_id', key);
  // }
}
