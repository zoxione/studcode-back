import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllFilterUserDto } from './dto/find-all-filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { FindAllReturnUser } from './types/find-all-return-user';
import { UserFiles } from './types/user-files';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private uploadService: UploadService,
  ) {}

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

  async findAll({
    search = '',
    page = 1,
    limit = 20,
    order = '_id',
  }: FindAllFilterUserDto): Promise<FindAllReturnUser> {
    const count = await this.userModel.countDocuments().exec();
    const searchQuery = search !== '' ? { $text: { $search: search } } : {};
    const foundUsers = await this.userModel
      .find(searchQuery)
      .select('-password -refresh_token')
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
        find_count: foundUsers.length,
        total_count: count,
        count_pages: Math.ceil(count / limit),
      },
      results: foundUsers,
    };
  }

  async findOne(field: keyof User, fieldValue: unknown): Promise<User>;
  async findOne(
    field: keyof User,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: true;
    },
  ): Promise<User>;
  async findOne(
    field: keyof User,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: false;
    },
  ): Promise<User | null>;
  async findOne(
    field: keyof User,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: boolean;
    } = { secret: false, throw: true },
  ): Promise<User | null> {
    let foundUser: User | null = null;
    const select = !options.secret ? '-password -refresh_token' : '';
    switch (field) {
      case '_id': {
        if (mongoose.Types.ObjectId.isValid(fieldValue as string)) {
          foundUser = await this.userModel.findOne({ _id: fieldValue }).select(select).exec();
        }
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
    if (!foundUser && options.throw) {
      throw new NotFoundException('User Not Found');
    }
    return foundUser;
  }

  async updateOne(field: keyof User, fieldValue: unknown, updateDto: Partial<UpdateUserDto>): Promise<User>;
  async updateOne(
    field: keyof User,
    fieldValue: unknown,
    updateDto: Partial<UpdateUserDto>,
    options: {
      throw?: true;
    },
  ): Promise<User>;
  async updateOne(
    field: keyof User,
    fieldValue: unknown,
    updateDto: Partial<UpdateUserDto>,
    options: {
      throw?: false;
    },
  ): Promise<User | null>;
  async updateOne(
    field: keyof User,
    fieldValue: unknown,
    updateDto: Partial<UpdateUserDto>,
    options: {
      throw?: boolean;
    } = { throw: true },
  ): Promise<User | null> {
    let updatedUser: User | null = null;
    switch (field) {
      case '_id': {
        if (mongoose.Types.ObjectId.isValid(fieldValue as string)) {
          updatedUser = await this.userModel
            .findOneAndUpdate({ _id: fieldValue }, updateDto, {
              new: true,
            })
            .exec();
        }
        break;
      }
      case 'username': {
        updatedUser = await this.userModel
          .findOneAndUpdate({ username: fieldValue }, updateDto, {
            new: true,
          })
          .exec();
        break;
      }
      case 'email': {
        updatedUser = await this.userModel
          .findOneAndUpdate({ email: fieldValue }, updateDto, {
            new: true,
          })
          .exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!updatedUser && options.throw) {
      throw new NotFoundException('User Not Updated');
    }
    return updatedUser;
  }

  async uploadFiles(user_id: mongoose.Types.ObjectId, files: UserFiles): Promise<User> {
    const userFiles: Pick<User, 'avatar'> = {
      avatar: '',
    };
    for (const file of files.flat()) {
      if (file.fieldname === 'avatar_file') {
        const res = await this.uploadService.upload(`user-${user_id}-avatar.${file.mimetype.split('/')[1]}`, file);
        userFiles.avatar = res;
      }
    }
    const updatedProject = await this.updateOne('_id', user_id, {
      ...userFiles,
    });
    return updatedProject;
  }

  async deleteOne(field: keyof User, fieldValue: unknown): Promise<User>;
  async deleteOne(
    field: keyof User,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: true;
    },
  ): Promise<User>;
  async deleteOne(
    field: keyof User,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: false;
    },
  ): Promise<User | null>;
  async deleteOne(
    field: keyof User,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: boolean;
    } = { secret: false, throw: true },
  ): Promise<User | null> {
    let deletedUser: User | null = null;
    switch (field) {
      case '_id': {
        if (mongoose.Types.ObjectId.isValid(fieldValue as string)) {
          deletedUser = await this.userModel.findByIdAndRemove({ _id: fieldValue }).exec();
        }
        break;
      }
      case 'username': {
        deletedUser = await this.userModel.findByIdAndRemove({ username: fieldValue }).exec();
        break;
      }
      case 'email': {
        deletedUser = await this.userModel.findByIdAndRemove({ email: fieldValue }).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!deletedUser && options.throw) {
      throw new NotFoundException('User Not Deleted');
    }
    return deletedUser;
  }
}
