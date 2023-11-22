import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { FindAllReturnDto } from '../../common/dto/find-all-return.dto';
import { Tag } from './schemas/tag.schema';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private readonly tagModel: Model<Tag>) {}

  async createOne(createTagDto: CreateTagDto): Promise<Tag> {
    const createdTag = await this.tagModel.create(createTagDto);
    return createdTag;
  }

  async findAll({ search = '', page = 0, limit = 20 }: FindAllQueryDto): Promise<FindAllReturnDto> {
    const count = await this.tagModel.countDocuments().exec();
    const searchQuery = search !== '' ? { $text: { $search: search } } : {};
    const foundTags = await this.tagModel
      .find(searchQuery)
      .skip(page * limit)
      .limit(limit)
      .exec();
    return { stats: { total_count: count }, data: foundTags };
  }

  async findOne(field: keyof Tag, fieldValue: unknown): Promise<Tag> {
    let foundTag: Tag | null = null;
    switch (field) {
      case '_id': {
        foundTag = await this.tagModel.findOne({ _id: fieldValue }).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!foundTag) {
      throw new NotFoundException('Tag Not Found');
    }
    return foundTag;
  }

  async updateOne(field: keyof Tag, fieldValue: unknown, updateDto: Partial<UpdateTagDto>): Promise<Tag> {
    let updatedTag: Tag | null = null;
    switch (field) {
      case '_id': {
        updatedTag = await this.tagModel
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
    if (!updatedTag) {
      throw new NotFoundException('Tag Not Updated');
    }
    return updatedTag;
  }

  async deleteOne(field: keyof Tag, fieldValue: unknown): Promise<Tag> {
    let deletedTag: Tag | null = null;
    switch (field) {
      case '_id': {
        deletedTag = await this.tagModel.findByIdAndRemove({ _id: fieldValue }).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!deletedTag) {
      throw new NotFoundException('Tag Not Deleted');
    }
    return deletedTag;
  }
}
