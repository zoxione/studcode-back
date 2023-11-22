import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { FindAllReturnDto } from '../../common/dto/find-all-return.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async createOne(createUserDto: CreateUserDto): Promise<User> {
    let foundUser = await this.userModel.findOne({ username: createUserDto.username }).exec();
    if (foundUser) {
      throw new ConflictException(`Username ${createUserDto.username} already exists`);
    }
    foundUser = await this.userModel.findOne({ email: createUserDto.email }).exec();
    if (foundUser) {
      throw new ConflictException(`Email ${createUserDto.email} already exists`);
    }
    const createdUser = await this.userModel.create(createUserDto);
    return createdUser;
  }

  async findAll({ search = '', page = 0, limit = 20 }: FindAllQueryDto): Promise<FindAllReturnDto> {
    const count = await this.userModel.countDocuments().exec();
    const searchQuery = search !== '' ? { $text: { $search: search } } : {};
    const foundUsers = await this.userModel
      .find(searchQuery)
      .select('-password -refresh_token')
      .skip(page * limit)
      .limit(limit)
      .exec();
    return { stats: { total_count: count }, data: foundUsers };
  }

  async findOne(field: keyof User, fieldValue: unknown, withSecret: boolean = false): Promise<User> {
    let foundUser: User | null = null;
    let select = '-password -refresh_token';
    if (withSecret) {
      select = '';
    }
    switch (field) {
      case '_id': {
        foundUser = await this.userModel.findOne({ _id: fieldValue }).select(select).exec();
        break;
      }
      case 'username': {
        foundUser = await this.userModel.findOne({ username: fieldValue }).select(select).exec();
        break;
      }
      case 'email': {
        foundUser = await this.userModel.findOne({ email: fieldValue }).select(select).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!foundUser) {
      throw new NotFoundException('User Not Found');
    }
    return foundUser;
  }

  async updateOne(field: keyof User, fieldValue: unknown, updateDto: Partial<UpdateUserDto>): Promise<User> {
    let updatedUser: User | null = null;
    switch (field) {
      case '_id': {
        updatedUser = await this.userModel
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
    if (!updatedUser) {
      throw new NotFoundException('User Not Updated');
    }
    return updatedUser;
  }

  async deleteOne(field: keyof User, fieldValue: unknown): Promise<User> {
    let deletedUser: User | null = null;
    switch (field) {
      case '_id': {
        deletedUser = await this.userModel.findByIdAndRemove({ _id: fieldValue }).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!deletedUser) {
      throw new NotFoundException('User Not Deleted');
    }
    return deletedUser;
  }
}
