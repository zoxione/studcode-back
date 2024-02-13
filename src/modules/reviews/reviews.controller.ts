import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { FindAllFilterReviewDto } from './dto/find-all-filter-review.dto';
import { FindAllReturnReview } from './types/find-all-return-review';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';
import { Review } from './schemas/review.schema';

@ApiBearerAuth()
@ApiTags('reviews')
@Controller({ path: 'reviews', version: '1' })
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/')
  @ApiOperation({ summary: 'Создание нового обзора' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Review })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async createOne(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewsService.createOne(createReviewDto);
  }

  @Get('/')
  @ApiOperation({ summary: 'Получение списка обзоров' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Review })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(@Query() query: FindAllFilterReviewDto): Promise<FindAllReturnReview> {
    return this.reviewsService.findAll(query);
  }

  @Get('/:key')
  @ApiOperation({ summary: 'Получение обзора по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Review })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOneById(@Param('key') key: string): Promise<Review> {
    return this.reviewsService.findOne('_id', key);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:key')
  @ApiOperation({ summary: 'Обновление обзора по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Review })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async updateOneById(@Param('key') key: string, @Body() updateDto: UpdateReviewDto): Promise<Review> {
    return this.reviewsService.updateOne('_id', key, updateDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:key')
  @ApiOperation({ summary: 'Удаление обзора по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Review })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async deleteOneById(@Param('key') key: string): Promise<Review> {
    return this.reviewsService.deleteOne('_id', key);
  }
}
