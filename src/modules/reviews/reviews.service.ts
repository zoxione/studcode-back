import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ProjectsService } from '../projects/projects.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { FindAllFilterReviewDto } from './dto/find-all-filter-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './schemas/review.schema';
import { FindAllReturnReview } from './types/find-all-return-review';
import { ReactionsService } from '../reactions/reactions.service';
import { ReactionType } from '../reactions/types/reaction-type';
import { CreateReactionDto } from '../reactions/dto/create-reaction.dto';
import { Reaction } from '../reactions/schemas/reaction.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ReviewsService {
  private readonly populations = [
    {
      path: 'project',
      select: '_id title',
    },
    {
      path: 'reviewer',
      select: '_id username full_name.surname full_name.name full_name.patronymic avatar',
    },
  ];

  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private projectsService: ProjectsService,
  ) {}

  async createOne(createReviewDto: CreateReviewDto): Promise<Review> {
    const existingReview = await this.reviewModel.findOne({
      project: createReviewDto.project,
      reviewer: createReviewDto.reviewer,
    });
    if (existingReview) {
      throw new ConflictException(`Review for project ${createReviewDto.project} already exists`);
    }
    const existingProject = await this.projectsService.findOne('_id', createReviewDto.project);
    const createdReview = await this.reviewModel.create(createReviewDto);
    const reviewsProject = await this.reviewModel.find({ project: createReviewDto.project });
    const avg_rating = reviewsProject.reduce((sum, review) => sum + review.rating, 0) / reviewsProject.length;
    const updatedProject = await this.projectsService.updateOne('_id', createReviewDto.project, {
      rating: avg_rating,
    });
    await createdReview.populate(this.populations);
    return createdReview;
  }

  async findAll({
    search = '',
    page = 1,
    limit = 20,
    order = '_id',
    project_id = '',
  }: FindAllFilterReviewDto): Promise<FindAllReturnReview> {
    const count = await this.reviewModel.countDocuments().exec();
    const searchQuery = search !== '' ? { $text: { $search: search } } : {};
    const projectQuery = project_id !== '' ? { project: project_id } : {};
    const foundReviews = await this.reviewModel
      .find({
        ...searchQuery,
        ...projectQuery,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(this.populations)
      .sort({ [order]: order[0] === '!' ? -1 : 1 })
      .exec();
    return {
      filter: {
        page,
        limit,
        search,
        order,
        project_id,
      },
      info: {
        find_count: foundReviews.length,
        total_count: count,
        count_pages: Math.ceil(count / limit),
      },
      results: foundReviews,
    };
  }

  async findOne(field: keyof Review, fieldValue: unknown): Promise<Review>;
  async findOne(
    field: keyof Review,
    fieldValue: unknown,
    options: {
      throw?: true;
    },
  ): Promise<Review>;
  async findOne(
    field: keyof Review,
    fieldValue: unknown,
    options: {
      throw?: false;
    },
  ): Promise<Review | null>;
  async findOne(
    field: keyof Review,
    fieldValue: unknown,
    options: {
      throw?: boolean;
    } = { throw: true },
  ): Promise<Review | null> {
    let foundReview: Review | null = null;
    switch (field) {
      case '_id': {
        foundReview = await this.reviewModel.findOne({ _id: fieldValue }).populate(this.populations).exec();
        break;
      }
      case 'project': {
        foundReview = await this.reviewModel.findOne({ project: fieldValue }).populate(this.populations).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!foundReview && options.throw) {
      throw new NotFoundException('Review Not Found');
    }
    return foundReview;
  }

  async updateOne(field: keyof Review, fieldValue: unknown, updateDto: Partial<UpdateReviewDto>): Promise<Review>;
  async updateOne(
    field: keyof Review,
    fieldValue: unknown,
    updateDto: Partial<UpdateReviewDto>,
    options: {
      throw?: true;
    },
  ): Promise<Review>;
  async updateOne(
    field: keyof Review,
    fieldValue: unknown,
    updateDto: Partial<UpdateReviewDto>,
    options: {
      throw?: false;
    },
  ): Promise<Review | null>;
  async updateOne(
    field: keyof Review,
    fieldValue: unknown,
    updateDto: Partial<UpdateReviewDto>,
    options: {
      throw?: boolean;
    } = { throw: true },
  ): Promise<Review | null> {
    let updatedReview: Review | null = null;
    switch (field) {
      case '_id': {
        updatedReview = await this.reviewModel
          .findOneAndUpdate({ _id: fieldValue }, updateDto, {
            new: true,
          })
          .populate(this.populations)
          .exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!updatedReview && options.throw) {
      throw new NotFoundException('Review Not Updated');
    }
    return updatedReview;
  }

  async deleteOne(field: keyof Review, fieldValue: unknown): Promise<Review>;
  async deleteOne(
    field: keyof Review,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: true;
    },
  ): Promise<Review>;
  async deleteOne(
    field: keyof Review,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: false;
    },
  ): Promise<Review | null>;
  async deleteOne(
    field: keyof Review,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: boolean;
    } = { secret: false, throw: true },
  ): Promise<Review | null> {
    let deletedReview: Review | null = null;
    switch (field) {
      case '_id': {
        deletedReview = await this.reviewModel.findByIdAndRemove({ _id: fieldValue }).populate(this.populations).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!deletedReview && options.throw) {
      throw new NotFoundException('Review Not Deleted');
    }
    return deletedReview;
  }

  async reactionOne(
    field: keyof Review,
    fieldValue: unknown,
    createReactionDto: Pick<CreateReactionDto, 'type' | 'reacted_by'>,
  ): Promise<Review> {
    let review;
    switch (field) {
      case '_id': {
        if (mongoose.Types.ObjectId.isValid(fieldValue as string)) {
          review = await this.reviewModel.findOne({ _id: fieldValue }).populate(this.populations).exec();
        }
        break;
      }
      default: {
        break;
      }
    }
    if (!review) {
      throw new NotFoundException('Review Not Found');
    }

    const user = await this.userModel.findOne({ _id: createReactionDto.reacted_by });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const reaction = await this.reactionModel.findOne({
      review: review._id,
      reacted_by: user._id,
    });

    if (!reaction || reaction.type !== createReactionDto.type) {
      await this.reactionModel.updateOne(
        {
          review: review._id,
          reacted_by: user._id,
        },
        {
          $set: {
            type: createReactionDto.type,
            review: review._id,
            reacted_by: user._id,
          },
        },
        {
          upsert: true,
        },
      );
      if (!reaction) {
        if (createReactionDto.type === ReactionType.Like) {
          review.likes += 1;
        } else if (createReactionDto.type === ReactionType.Dislike) {
          review.dislikes += 1;
        }
      } else if (reaction.type !== createReactionDto.type) {
        if (createReactionDto.type === ReactionType.Like) {
          review.likes += 1;
          review.dislikes -= 1;
        } else if (createReactionDto.type === ReactionType.Dislike) {
          review.likes -= 1;
          review.dislikes += 1;
        }
      }
      review.save();
    } else {
      throw new ConflictException(`Review Already ${createReactionDto.type}d`);
    }
    return review;
  }
}
