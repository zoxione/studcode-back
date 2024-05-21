import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { OperationOptions } from '../../common/types/operation-options';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { FindAllFilterSpecializationDto } from './dto/find-all-filter-specialization.dto';
import { Specialization } from './schemas/specialization.schema';
import { FindAllReturnSpecialization } from './types/find-all-return-specialization';
import { convertIncorrectKeyboard } from '../../common/utils/convert-incorrect-keyboard';

@Injectable()
export class SpecializationsService {
  constructor(@InjectModel(Specialization.name) private readonly specializationModel: Model<Specialization>) {}

  async createOne(createSpecializationDto: CreateSpecializationDto): Promise<Specialization> {
    const createdSpecialization = await this.specializationModel.create(createSpecializationDto);
    return createdSpecialization.toObject();
  }

  async findAll({
    search = '',
    page = 1,
    limit = 20,
    order = '_id',
  }: FindAllFilterSpecializationDto): Promise<FindAllReturnSpecialization> {
    const count = await this.specializationModel.countDocuments().exec();
    const searchQuery = search !== '' ? { name: { $in: convertIncorrectKeyboard(search) } } : {};
    const foundSpecializations = await this.specializationModel
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
        find_count: foundSpecializations.length,
        total_count: count,
        count_pages: Math.ceil(count / limit),
      },
      results: foundSpecializations,
    };
  }

  async findOne({ fields, fieldValue }: OperationOptions<Specialization>): Promise<Specialization> {
    let foundSpecialization = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      foundSpecialization = await this.specializationModel.findOne({ [field]: fieldValue }).exec();
      if (foundSpecialization) break;
    }
    if (!foundSpecialization) {
      throw new NotFoundException('Specialization not found');
    }
    return foundSpecialization.toObject();
  }
}
