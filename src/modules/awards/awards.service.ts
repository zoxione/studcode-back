import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAwardDto } from './dto/create-award.dto';
import { FindAllFilterAwardDto } from './dto/find-all-filter-award.dto';
import { UpdateAwardDto } from './dto/update-award.dto';
import { Award } from './schemas/award.schema';
import { FindAllReturnAward } from './types/find-all-return-award';

@Injectable()
export class AwardsService {
  constructor(@InjectModel(Award.name) private readonly awardModel: Model<Award>) {}

  async createOne(createAwardDto: CreateAwardDto): Promise<Award> {
    const createdAward = await this.awardModel.create(createAwardDto);
    return createdAward;
  }

  async findAll({
    search = '',
    page = 1,
    limit = 20,
    order = '_id',
  }: FindAllFilterAwardDto): Promise<FindAllReturnAward> {
    const count = await this.awardModel.countDocuments().exec();
    const searchQuery = search !== '' ? { $text: { $search: search } } : {};
    const foundAwards = await this.awardModel
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
        find_count: foundAwards.length,
        total_count: count,
        count_pages: Math.ceil(count / limit),
      },
      results: foundAwards,
    };
  }

  async findOne(field: keyof Award, fieldValue: unknown): Promise<Award> {
    let foundAward: Award | null = null;
    switch (field) {
      case '_id': {
        foundAward = await this.awardModel.findOne({ _id: fieldValue }).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!foundAward) {
      throw new NotFoundException('Award Not Found');
    }
    return foundAward;
  }

  async updateOne(field: keyof Award, fieldValue: unknown, updateDto: Partial<UpdateAwardDto>): Promise<Award> {
    let updatedAward: Award | null = null;
    switch (field) {
      case '_id': {
        updatedAward = await this.awardModel
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
    if (!updatedAward) {
      throw new NotFoundException('Award Not Updated');
    }
    return updatedAward;
  }

  async deleteOne(field: keyof Award, fieldValue: unknown): Promise<Award> {
    let deletedAward: Award | null = null;
    switch (field) {
      case '_id': {
        deletedAward = await this.awardModel.findByIdAndRemove({ _id: fieldValue }).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!deletedAward) {
      throw new NotFoundException('Award Not Deleted');
    }
    return deletedAward;
  }
}
