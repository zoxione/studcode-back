import slugify from '@sindresorhus/slugify';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Project } from '../projects/schemas/project.schema';
import { ProjectStatus } from '../projects/types/project-status';
import { CreateTagDto } from './dto/create-tag.dto';
import { FindAllFilterTagDto } from './dto/find-all-filter-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './schemas/tag.schema';
import { FindAllReturnTag } from './types/find-all-return-tag';

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
    const updatedTag = await this.tagModel
      .findByIdAndUpdate({ _id: createdTag._id }, { $set: { slug: this.generateSlug(createdTag.name) } }, { new: true })
      .exec();
    return updatedTag as Tag;
  }

  async findAll({ search = '', page = 1, limit = 20, order = '_id' }: FindAllFilterTagDto): Promise<FindAllReturnTag> {
    const count = await this.tagModel.countDocuments().exec();
    const searchQuery = search !== '' ? { $text: { $search: search } } : {};
    const foundTags = await this.tagModel
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

  async findOne(field: keyof Tag, fieldValue: unknown): Promise<Tag>;
  async findOne(
    field: keyof Tag,
    fieldValue: unknown,
    options: {
      throw?: true;
    },
  ): Promise<Tag>;
  async findOne(
    field: keyof Tag,
    fieldValue: unknown,
    options: {
      throw?: false;
    },
  ): Promise<Tag | null>;
  async findOne(
    field: keyof Tag,
    fieldValue: unknown,
    options: {
      throw?: boolean;
    } = { throw: true },
  ): Promise<Tag | null> {
    let foundTag: Tag | null = null;
    switch (field) {
      case '_id': {
        if (mongoose.Types.ObjectId.isValid(fieldValue as string)) {
          foundTag = await this.tagModel.findOne({ _id: fieldValue }).exec();
        }
        break;
      }
      case 'slug': {
        foundTag = await this.tagModel.findOne({ slug: fieldValue }).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!foundTag && options.throw) {
      throw new NotFoundException('Tag Not Found');
    }
    return foundTag;
  }

  async updateOne(field: keyof Tag, fieldValue: unknown, updateDto: Partial<UpdateTagDto>): Promise<Tag>;
  async updateOne(
    field: keyof Tag,
    fieldValue: unknown,
    updateDto: Partial<UpdateTagDto>,
    options: {
      throw?: true;
    },
  ): Promise<Tag>;
  async updateOne(
    field: keyof Tag,
    fieldValue: unknown,
    updateDto: Partial<UpdateTagDto>,
    options: {
      throw?: false;
    },
  ): Promise<Tag | null>;
  async updateOne(
    field: keyof Tag,
    fieldValue: unknown,
    updateDto: Partial<UpdateTagDto>,
    options: {
      throw?: boolean;
    } = { throw: true },
  ): Promise<Tag | null> {
    let updatedTag: Tag | null = null;
    switch (field) {
      case '_id': {
        if (mongoose.Types.ObjectId.isValid(fieldValue as string)) {
          updatedTag = await this.tagModel
            .findOneAndUpdate({ _id: fieldValue }, updateDto, {
              new: true,
            })
            .exec();
        }
        break;
      }
      case 'slug': {
        updatedTag = await this.tagModel
          .findOneAndUpdate({ slug: fieldValue }, updateDto, {
            new: true,
          })
          .exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!updatedTag && options.throw) {
      throw new NotFoundException('Tag Not Updated');
    }
    if (updatedTag && updateDto.name) {
      updatedTag = await this.tagModel
        .findOneAndUpdate(
          { _id: updatedTag._id },
          { $set: { slug: this.generateSlug(updatedTag.name) } },
          {
            new: true,
          },
        )
        .exec();
    }
    return updatedTag;
  }

  async deleteOne(field: keyof Tag, fieldValue: unknown): Promise<Tag>;
  async deleteOne(
    field: keyof Tag,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: true;
    },
  ): Promise<Tag>;
  async deleteOne(
    field: keyof Tag,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: false;
    },
  ): Promise<Tag | null>;
  async deleteOne(
    field: keyof Tag,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: boolean;
    } = { secret: false, throw: true },
  ): Promise<Tag | null> {
    let deletedTag: Tag | null = null;
    switch (field) {
      case '_id': {
        if (mongoose.Types.ObjectId.isValid(fieldValue as string)) {
          deletedTag = await this.tagModel.findByIdAndRemove({ _id: fieldValue }).exec();
        }
        break;
      }
      case 'slug': {
        deletedTag = await this.tagModel.findByIdAndRemove({ slug: fieldValue }).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!deletedTag && options.throw) {
      throw new NotFoundException('Tag Not Deleted');
    }
    return deletedTag;
  }
}
