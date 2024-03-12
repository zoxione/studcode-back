import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectsService } from '../projects/projects.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { FindAllFilterReactionDto } from './dto/find-all-filter-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { Reaction } from './schemas/reaction.schema';
import { FindAllReturnReaction } from './types/find-all-return-reaction';

@Injectable()
export class ReactionsService {
  private readonly populations = [
    {
      path: 'review',
      select: '_id rating',
    },
    {
      path: 'reacted_by',
      select: '_id username full_name.surname full_name.name full_name.patronymic avatar',
    },
  ];

  constructor(@InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>) {}

  async createOne(createReactionDto: CreateReactionDto): Promise<Reaction> {
    const createdReaction = await this.reactionModel.create(createReactionDto);
    await createdReaction.populate(this.populations);
    return createdReaction;
  }

  async findAll({
    search = '',
    page = 1,
    limit = 20,
    order = '_id',
    review_id = '',
  }: FindAllFilterReactionDto): Promise<FindAllReturnReaction> {
    const count = await this.reactionModel.countDocuments().exec();
    const searchQuery = search !== '' ? { $text: { $search: search } } : {};
    const reviewQuery = review_id !== '' ? { review: review_id } : {};
    const foundReactions = await this.reactionModel
      .find({
        ...searchQuery,
        ...reviewQuery,
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
        review_id,
      },
      info: {
        find_count: foundReactions.length,
        total_count: count,
        count_pages: Math.ceil(count / limit),
      },
      results: foundReactions,
    };
  }

  async findOne(field: keyof Reaction, fieldValue: unknown): Promise<Reaction>;
  async findOne(
    field: keyof Reaction,
    fieldValue: unknown,
    options: {
      throw?: true;
    },
  ): Promise<Reaction>;
  async findOne(
    field: keyof Reaction,
    fieldValue: unknown,
    options: {
      throw?: false;
    },
  ): Promise<Reaction | null>;
  async findOne(
    field: keyof Reaction,
    fieldValue: unknown,
    options: {
      throw?: boolean;
    } = { throw: true },
  ): Promise<Reaction | null> {
    let foundReaction: Reaction | null = null;
    switch (field) {
      case '_id': {
        foundReaction = await this.reactionModel.findOne({ _id: fieldValue }).populate(this.populations).exec();
        break;
      }
      case 'review': {
        foundReaction = await this.reactionModel.findOne({ review: fieldValue }).populate(this.populations).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!foundReaction && options.throw) {
      throw new NotFoundException('Reaction Not Found');
    }
    return foundReaction;
  }

  async updateOne(field: keyof Reaction, fieldValue: unknown, updateDto: Partial<UpdateReactionDto>): Promise<Reaction>;
  async updateOne(
    field: keyof Reaction,
    fieldValue: unknown,
    updateDto: Partial<UpdateReactionDto>,
    options: {
      throw?: true;
    },
  ): Promise<Reaction>;
  async updateOne(
    field: keyof Reaction,
    fieldValue: unknown,
    updateDto: Partial<UpdateReactionDto>,
    options: {
      throw?: false;
    },
  ): Promise<Reaction | null>;
  async updateOne(
    field: keyof Reaction,
    fieldValue: unknown,
    updateDto: Partial<UpdateReactionDto>,
    options: {
      throw?: boolean;
    } = { throw: true },
  ): Promise<Reaction | null> {
    let updatedReaction: Reaction | null = null;
    switch (field) {
      case '_id': {
        updatedReaction = await this.reactionModel
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
    if (!updatedReaction && options.throw) {
      throw new NotFoundException('Reaction Not Updated');
    }
    return updatedReaction;
  }

  async deleteOne(field: keyof Reaction, fieldValue: unknown): Promise<Reaction>;
  async deleteOne(
    field: keyof Reaction,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: true;
    },
  ): Promise<Reaction>;
  async deleteOne(
    field: keyof Reaction,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: false;
    },
  ): Promise<Reaction | null>;
  async deleteOne(
    field: keyof Reaction,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: boolean;
    } = { secret: false, throw: true },
  ): Promise<Reaction | null> {
    let deletedReaction: Reaction | null = null;
    switch (field) {
      case '_id': {
        deletedReaction = await this.reactionModel
          .findByIdAndRemove({ _id: fieldValue })
          .populate(this.populations)
          .exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!deletedReaction && options.throw) {
      throw new NotFoundException('Reaction Not Deleted');
    }
    return deletedReaction;
  }
}
