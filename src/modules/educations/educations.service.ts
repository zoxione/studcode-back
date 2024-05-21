import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { OperationOptions } from '../../common/types/operation-options';
import { CreateEducationDto } from './dto/create-education.dto';
import { FindAllFilterEducationDto } from './dto/find-all-filter-education.dto';
import { Education } from './schemas/education.schema';
import { FindAllReturnEducation } from './types/find-all-return-education';
import { convertIncorrectKeyboard } from '../../common/utils/convert-incorrect-keyboard';

@Injectable()
export class EducationsService {
  constructor(@InjectModel(Education.name) private readonly educationModel: Model<Education>) {}

  async createOne(createEducationDto: CreateEducationDto): Promise<Education> {
    const createdEducation = await this.educationModel.create(createEducationDto);
    return createdEducation.toObject();
  }

  async findAll({ search = '', page = 1, limit = 20, order = '_id' }: FindAllFilterEducationDto): Promise<FindAllReturnEducation> {
    const count = await this.educationModel.countDocuments().exec();
    const searchQuery = search !== '' ? { name: { $in: convertIncorrectKeyboard(search) } } : {};
    const foundEducations = await this.educationModel
      .find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [order[0] === '!' ? order.slice(1) : order]: order[0] === '!' ? -1 : 1 })
      .exec();
    return {
      filter: {
        page,
        limit,
        search,
        order,
      },
      info: {
        find_count: foundEducations.length,
        total_count: count,
        count_pages: Math.ceil(count / limit),
      },
      results: foundEducations,
    };
  }

  async findOne({ fields, fieldValue }: OperationOptions<Education>): Promise<Education> {
    let foundEducation = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      foundEducation = await this.educationModel.findOne({ [field]: fieldValue }).exec();
      if (foundEducation) break;
    }
    if (!foundEducation) {
      throw new NotFoundException('Education not found');
    }
    return foundEducation.toObject();
  }
}
