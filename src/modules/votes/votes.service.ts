import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVoteDto } from './dto/create-vote.dto';
import { FindAllFilterVoteDto } from './dto/find-all-filter-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { Vote } from './schemas/vote.schema';
import { FindAllReturnVote } from './types/find-all-return-vote';

@Injectable()
export class VotesService {
  constructor(@InjectModel(Vote.name) private readonly voteModel: Model<Vote>) {}

  async createOne(createVoteDto: CreateVoteDto): Promise<Vote> {
    const createdVote = await this.voteModel.create(createVoteDto);
    return createdVote;
  }

  async findAll({
    search = '',
    page = 1,
    limit = 20,
    order = '_id',
  }: FindAllFilterVoteDto): Promise<FindAllReturnVote> {
    const count = await this.voteModel.countDocuments().exec();
    const searchQuery = search !== '' ? { $text: { $search: search } } : {};
    const foundVotes = await this.voteModel
      .find(searchQuery)
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
      },
      info: {
        find_count: foundVotes.length,
        total_count: count,
        count_pages: Math.ceil(count / limit),
      },
      results: foundVotes,
    };
  }

  async findOne(field: keyof Vote, fieldValue: unknown): Promise<Vote>;
  async findOne(
    field: keyof Vote,
    fieldValue: unknown,
    options: {
      throw?: true;
    },
  ): Promise<Vote>;
  async findOne(
    field: keyof Vote,
    fieldValue: unknown,
    options: {
      throw?: false;
    },
  ): Promise<Vote | null>;
  async findOne(
    field: keyof Vote,
    fieldValue: unknown,
    options: {
      throw?: boolean;
    } = { throw: true },
  ): Promise<Vote | null> {
    let foundVote: Vote | null = null;
    switch (field) {
      case '_id': {
        foundVote = await this.voteModel.findOne({ _id: fieldValue }).exec();
        break;
      }
      case 'project': {
        foundVote = await this.voteModel.findOne({ project: fieldValue }).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!foundVote && options.throw) {
      throw new NotFoundException('Vote Not Found');
    }
    return foundVote;
  }

  async updateOne(field: keyof Vote, fieldValue: unknown, updateDto: Partial<UpdateVoteDto>): Promise<Vote>;
  async updateOne(
    field: keyof Vote,
    fieldValue: unknown,
    updateDto: Partial<UpdateVoteDto>,
    options: {
      throw?: true;
    },
  ): Promise<Vote>;
  async updateOne(
    field: keyof Vote,
    fieldValue: unknown,
    updateDto: Partial<UpdateVoteDto>,
    options: {
      throw?: false;
    },
  ): Promise<Vote | null>;
  async updateOne(
    field: keyof Vote,
    fieldValue: unknown,
    updateDto: Partial<UpdateVoteDto>,
    options: {
      throw?: boolean;
    } = { throw: true },
  ): Promise<Vote | null> {
    let updatedVote: Vote | null = null;
    switch (field) {
      case '_id': {
        updatedVote = await this.voteModel
          .findOneAndUpdate({ _id: fieldValue }, updateDto, {
            new: true,
          })
          .exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!updatedVote && options.throw) {
      throw new NotFoundException('Vote Not Updated');
    }
    return updatedVote;
  }

  async deleteOne(field: keyof Vote, fieldValue: unknown): Promise<Vote>;
  async deleteOne(
    field: keyof Vote,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: true;
    },
  ): Promise<Vote>;
  async deleteOne(
    field: keyof Vote,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: false;
    },
  ): Promise<Vote | null>;
  async deleteOne(
    field: keyof Vote,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: boolean;
    } = { secret: false, throw: true },
  ): Promise<Vote | null> {
    let deletedVote: Vote | null = null;
    switch (field) {
      case '_id': {
        deletedVote = await this.voteModel.findByIdAndRemove({ _id: fieldValue }).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!deletedVote && options.throw) {
      throw new NotFoundException('Vote Not Deleted');
    }
    return deletedVote;
  }
}
