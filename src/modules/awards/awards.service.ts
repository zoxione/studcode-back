import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { FindAllReturnDto } from '../../common/dto/find-all-return.dto';
import { CreateAwardDto } from './dto/create-award.dto';
import { Award } from './schemas/award.schema';
import { UpdateAwardDto } from './dto/update-award.dto';

@Injectable()
export class AwardsService {
  constructor(@InjectModel(Award.name) private readonly awardModel: Model<Award>) {}

  async createOne(createAwardDto: CreateAwardDto): Promise<Award> {
    const createdAward = await this.awardModel.create(createAwardDto);
    return createdAward;
  }

  async findAll({ search = '', page = 0, limit = 20 }: FindAllQueryDto): Promise<FindAllReturnDto> {
    const count = await this.awardModel.countDocuments().exec();
    const searchQuery = search !== '' ? { $text: { $search: search } } : {};
    const foundAwards = await this.awardModel
      .find(searchQuery)
      .skip(page * limit)
      .limit(limit)
      .exec();
    return { stats: { total_count: count }, data: foundAwards };
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
