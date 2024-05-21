import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import slugify from '@sindresorhus/slugify';
import mongoose, { Model } from 'mongoose';
import { OperationOptions } from '../../common/types/operation-options';
import { Project } from '../projects/schemas/project.schema';
import { ProjectStatus } from '../projects/types/project-status';
import { CreateTagDto } from './dto/create-tag.dto';
import { FindAllFilterTagDto } from './dto/find-all-filter-tag.dto';
import { Tag } from './schemas/tag.schema';
import { FindAllReturnTag } from './types/find-all-return-tag';
import { convertIncorrectKeyboard } from '../../common/utils/convert-incorrect-keyboard';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private readonly tagModel: Model<Tag>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {}

  private generateSlug(title: string): string {
    return `${slugify(title, { decamelize: false })}`;
  }

  async createOne(createTagDto: CreateTagDto): Promise<Tag> {
    const createdTag = await this.tagModel.create(createTagDto);
    createdTag.slug = this.generateSlug(createdTag.name);
    await createdTag.save();
    return createdTag.toObject();
  }

  async findAll({ search = '', page = 1, limit = 20, order = '_id' }: FindAllFilterTagDto): Promise<FindAllReturnTag> {
    const count = await this.tagModel.countDocuments().exec();
    const searchQuery = search !== '' ? { name: { $in: convertIncorrectKeyboard(search) } } : {};
    const foundTags = await this.tagModel
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
        find_count: foundTags.length,
        total_count: count,
        count_pages: Math.ceil(count / limit),
      },
      results: foundTags,
    };
  }

  async findAllPopular(): Promise<Tag[]> {
    const popularTags = await this.projectModel.aggregate([
      {
        $match: { status: ProjectStatus.Published }, // Фильтрация по статусу 'Published'
      },
      {
        $unwind: '$tags', // Разворачиваем массив тегов
      },
      {
        $group: {
          _id: '$tags', // Группируем по тегам
          count: { $sum: 1 }, // Считаем количество проектов для каждого тега
        },
      },
      {
        $sort: { count: -1 }, // Сортируем в убывающем порядке по количеству проектов
      },
      {
        $limit: 10, // Выбираем первые 10 тегов
      },
      {
        $lookup: {
          from: 'tags', // Имя коллекции тегов
          localField: '_id',
          foreignField: '_id',
          as: 'tagData', // Добавляем данные о теге
        },
      },
      {
        $unwind: '$tagData', // Разворачиваем массив с данными о теге
      },
      {
        $replaceRoot: { newRoot: '$tagData' }, // Заменяем корень документа на данные о теге
      },
    ]);
    return popularTags;
  }

  async findOne({ fields, fieldValue }: OperationOptions<Tag>): Promise<Tag> {
    let foundTag = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      foundTag = await this.tagModel.findOne({ [field]: fieldValue }).exec();
      if (foundTag) break;
    }
    if (!foundTag) {
      throw new NotFoundException('Tag not found');
    }
    return foundTag.toObject();
  }
}
