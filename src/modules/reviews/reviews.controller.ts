import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { FindAllFilterReviewDto } from './dto/find-all-filter-review.dto';
import { FindAllReturnReview } from './types/find-all-return-review';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';
import { Review } from './schemas/review.schema';
import { AuthUserRequest } from '../auth/types/auth-user-request';
import { CreateReactionDto } from '../reactions/dto/create-reaction.dto';
import { ReactionType } from '../reactions/types/reaction-type';

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
  async updateOneById(
    @Req() req: AuthUserRequest,
    @Param('key') key: string,
    @Body() updateDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.reviewsService.findOne('_id', key);
    if (review.reviewer._id.toString() !== req.user.sub) {
      throw new UnauthorizedException('You are not allowed to update this review');
    }
    return this.reviewsService.updateOne('_id', key, updateDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:key')
  @ApiOperation({ summary: 'Удаление обзора по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Review })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async deleteOneById(@Req() req: AuthUserRequest, @Param('key') key: string): Promise<Review> {
    const review = await this.reviewsService.findOne('_id', key);
    if (review.reviewer._id.toString() !== req.user.sub) {
      throw new UnauthorizedException('You are not allowed to update this review');
    }
    return this.reviewsService.deleteOne('_id', key);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:key/like')
  @ApiOperation({ summary: 'Лайк обзора по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Review })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async likeOne(@Req() req: AuthUserRequest, @Param('key') key: string): Promise<Review> {
    return this.reviewsService.reactionOne('_id', key, {
      type: ReactionType.Like,
      reacted_by: req.user.sub,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:key/dislike')
  @ApiOperation({ summary: 'Дизлайк обзора по ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Review })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async dislikeOne(@Req() req: AuthUserRequest, @Param('key') key: string): Promise<Review> {
    return this.reviewsService.reactionOne('_id', key, {
      type: ReactionType.Dislike,
      reacted_by: req.user.sub,
    });
  }
}
