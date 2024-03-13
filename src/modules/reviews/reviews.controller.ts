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
import { AuthUserRequest } from '../auth/types/auth-user-request';
import { ReactionType } from '../reactions/types/reaction-type';
import { CreateReviewDto } from './dto/create-review.dto';
import { FindAllFilterReviewDto } from './dto/find-all-filter-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';
import { Review } from './schemas/review.schema';
import { FindAllReturnReview } from './types/find-all-return-review';

@ApiBearerAuth()
@ApiTags('reviews')
@Controller({ path: 'reviews', version: '1' })
export class ReviewsController {
  private readonly fields: (keyof Review)[] = ['_id'];

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
  @ApiOperation({ summary: 'Получение обзора по _id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Review })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOne(@Param('key') key: string): Promise<Review> {
    return this.reviewsService.findOne({ fields: this.fields, fieldValue: key });
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:key')
  @ApiOperation({ summary: 'Обновление обзора по _id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Review })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async updateOne(
    @Req() req: AuthUserRequest,
    @Param('key') key: string,
    @Body() updateDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.reviewsService.findOne({ fields: this.fields, fieldValue: key });
    if (review.reviewer._id.toString() !== req.user.sub) {
      throw new UnauthorizedException('You are not allowed to update this review');
    }
    return this.reviewsService.updateOne({ fields: this.fields, fieldValue: key, updateDto: updateDto });
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:key')
  @ApiOperation({ summary: 'Удаление обзора по _id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Review })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async deleteOne(@Req() req: AuthUserRequest, @Param('key') key: string): Promise<Review> {
    const review = await this.reviewsService.findOne({ fields: this.fields, fieldValue: key });
    if (review.reviewer._id.toString() !== req.user.sub) {
      throw new UnauthorizedException('You are not allowed to delete this review');
    }
    return this.reviewsService.deleteOne({ fields: this.fields, fieldValue: key });
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:key/like')
  @ApiOperation({ summary: 'Лайк обзора по _id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Review })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async likeOne(@Req() req: AuthUserRequest, @Param('key') key: string): Promise<Review> {
    return this.reviewsService.reactionOne({
      fields: this.fields,
      fieldValue: key,
      createReactionDto: {
        type: ReactionType.Like,
        reacted_by: req.user.sub,
      },
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post('/:key/dislike')
  @ApiOperation({ summary: 'Дизлайк обзора по _id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Review })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async dislikeOne(@Req() req: AuthUserRequest, @Param('key') key: string): Promise<Review> {
    return this.reviewsService.reactionOne({
      fields: this.fields,
      fieldValue: key,
      createReactionDto: {
        type: ReactionType.Dislike,
        reacted_by: req.user.sub,
      },
    });
  }
}
