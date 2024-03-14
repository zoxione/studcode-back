import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { OperationOptions } from '../../common/types/operation-options';
import { Project } from '../projects/schemas/project.schema';
import { CreateReactionDto } from '../reactions/dto/create-reaction.dto';
import { Reaction } from '../reactions/schemas/reaction.schema';
import { ReactionType } from '../reactions/types/reaction-type';
import { User } from '../users/schemas/user.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { FindAllFilterReviewDto } from './dto/find-all-filter-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './schemas/review.schema';
import { FindAllReturnReview } from './types/find-all-return-review';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {}

  private calcAvgRating(reviewsProject: Review[]): number {
    if (reviewsProject.length === 0) {
      return 0;
    }
    return reviewsProject.reduce((sum, review) => sum + review.rating, 0) / reviewsProject.length;
  }

  private async updateProjectRating(project_id: mongoose.Types.ObjectId) {
    const project = await this.projectModel.findOne({ _id: project_id });
    if (!project) {
      throw new NotFoundException('Project review not found');
    }
    const reviewsProject = await this.reviewModel.find({ project: project_id });
    project.rating = this.calcAvgRating(reviewsProject);
    await project.save();
  }

  async createOne(createReviewDto: CreateReviewDto): Promise<Review> {
    const foundReview = await this.reviewModel.findOne({
      project: createReviewDto.project,
      reviewer: createReviewDto.reviewer,
    });
    if (foundReview) {
      throw new ConflictException(`Review for project ${createReviewDto.project} already exists`);
    }
    const project = await this.projectModel.findOne({ _id: createReviewDto.project });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    const user = await this.userModel.findOne({ _id: createReviewDto.reviewer });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const createdReview = await this.reviewModel.create(createReviewDto);
    await this.updateProjectRating(project._id);
    return createdReview.toObject();
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

  async findOne({ fields, fieldValue }: OperationOptions<Review>): Promise<Review> {
    let foundReview = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      foundReview = await this.reviewModel.findOne({ [field]: fieldValue }).exec();
      if (foundReview) break;
    }
    if (!foundReview) {
      throw new NotFoundException('Review not found');
    }
    return foundReview.toObject();
  }

  async updateOne({ fields, fieldValue, updateDto }: { updateDto: UpdateReviewDto } & OperationOptions<Review>): Promise<Review> {
    let updatedReview = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      updatedReview = await this.reviewModel
        .findOneAndUpdate(
          { [field]: fieldValue },
          { $set: updateDto },
          {
            new: true,
          },
        )
        .exec();
      if (updatedReview) break;
    }
    if (!updatedReview) {
      throw new NotFoundException('Review not updated');
    }
    await this.updateProjectRating(updatedReview.project._id);
    return updatedReview.toObject();
  }

  async deleteOne({ fields, fieldValue }: OperationOptions<Review>): Promise<Review> {
    let deletedReview = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      deletedReview = await this.reviewModel.findOneAndRemove({ [field]: fieldValue }).exec();
      if (deletedReview) break;
    }
    if (!deletedReview) {
      throw new NotFoundException('Review not deleted');
    }
    await this.updateProjectRating(deletedReview.project._id);
    await this.reactionModel.deleteMany({ review: deletedReview._id }).exec();
    return deletedReview.toObject();
  }

  async reactionOne({
    fields,
    fieldValue,
    createReactionDto,
  }: {
    createReactionDto: Pick<CreateReactionDto, 'type' | 'reacted_by'>;
  } & OperationOptions<Review>): Promise<Review> {
    let review = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      review = await this.reviewModel.findOne({ [field]: fieldValue }).exec();
      if (review) break;
    }
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    const user = await this.userModel.findOne({ _id: createReactionDto.reacted_by });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const reaction = await this.reactionModel.findOne({
      review: review._id,
      reacted_by: user._id,
    });
    if (!reaction || reaction.type !== createReactionDto.type) {
      await this.reactionModel.updateOne(
        { review: review._id, reacted_by: user._id },
        { $set: { type: createReactionDto.type, review: review._id, reacted_by: user._id } },
        { upsert: true },
      );
      if (!reaction) {
        // Если произошла первая реакция
        if (createReactionDto.type === ReactionType.Like) {
          review.likes += 1;
        } else if (createReactionDto.type === ReactionType.Dislike) {
          review.dislikes += 1;
        }
      } else if (reaction.type !== createReactionDto.type) {
        // Если произошла реакция другого типа
        if (createReactionDto.type === ReactionType.Like) {
          review.likes += 1;
          review.dislikes -= 1;
        } else if (createReactionDto.type === ReactionType.Dislike) {
          review.likes -= 1;
          review.dislikes += 1;
        }
      }
    } else {
      // Если реакция уже существует и тип не изменился
      await this.reactionModel.deleteOne({ review: review._id, reacted_by: user._id });
      if (reaction.type === ReactionType.Like) {
        review.likes -= 1;
      } else if (reaction.type === ReactionType.Dislike) {
        review.dislikes -= 1;
      }
    }

    await review.save();
    return review;
  }
}
