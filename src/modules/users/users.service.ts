import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { OperationOptions } from '../../common/types/operation-options';
import { convertIncorrectKeyboard } from '../../common/utils/convert-incorrect-keyboard';
import { getFilePath } from '../../common/utils/get-file-path';
import { ProjectsService } from '../projects/projects.service';
import { Reaction } from '../reactions/schemas/reaction.schema';
import { ReviewsService } from '../reviews/reviews.service';
import { TeamsService } from '../teams/teams.service';
import { Token } from '../tokens/schemas/token.schema';
import { UploadService } from '../upload/upload.service';
import { Vote } from '../votes/schemas/vote.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllFilterUserDto } from './dto/find-all-filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { FindAllReturnUser } from './types/find-all-return-user';
import { UserFiles } from './types/user-files';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
    @InjectModel(Vote.name) private readonly voteModel: Model<Vote>,
    @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
    private reviewsService: ReviewsService,
    private uploadService: UploadService,
    private projectsService: ProjectsService,
    private teamsService: TeamsService,
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

  async findAll({ search = '', page = 1, limit = 20, order = '_id' }: FindAllFilterUserDto): Promise<FindAllReturnUser> {
    const count = await this.userModel.countDocuments().exec();
    const searchQuery = search !== '' ? { username: { $in: convertIncorrectKeyboard(search) } } : {};
    const foundUsers = await this.userModel
      .find(searchQuery)
      .select('-password -refresh_token')
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
        find_count: foundUsers.length,
        total_count: count,
        count_pages: Math.ceil(count / limit),
      },
      results: foundUsers,
    };
  }

  async findOne({ fields, fieldValue, secret = false }: { secret?: boolean } & OperationOptions<User>): Promise<User> {
    let foundUser = null;
    const select = !secret ? '-password -refresh_token' : '';
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      foundUser = await this.userModel
        .findOne({ [field]: fieldValue })
        .select(select)
        .exec();
      if (foundUser) break;
    }
    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    return foundUser.toObject();
  }

  async updateOne({ fields, fieldValue, updateDto }: { updateDto: UpdateUserDto } & OperationOptions<User>): Promise<User> {
    let updatedUser = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      updatedUser = await this.userModel
        .findOneAndUpdate(
          { [field]: fieldValue },
          { $set: updateDto },
          {
            new: true,
          },
        )
        .exec();
      if (updatedUser) break;
    }
    if (!updatedUser) {
      throw new NotFoundException('User not updated');
    }
    return updatedUser.toObject();
  }

  async deleteOne({ fields, fieldValue }: OperationOptions<User>): Promise<User> {
    let user = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      user = await this.userModel.findOne({ [field]: fieldValue }).exec();
      if (user) break;
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.tokenModel.deleteMany({ user: user._id }).exec();
    const projectsUser = await this.projectsService.findAll({ creator_id: user._id.toString() });
    for (const project of projectsUser.results) {
      await this.projectsService.deleteOne({ fields: ['_id'], fieldValue: project._id.toString() });
    }
    const teamsUser = await this.teamsService.findAll({ member_id: user._id.toString() });
    for (const team of teamsUser.results) {
      await this.teamsService.leave({ fields: ['_id'], fieldValue: team._id.toString(), userId: user._id.toString() });
    }
    await this.voteModel.deleteMany({ voter: user._id }).exec();
    await this.reactionModel.deleteMany({ reacted_by: user._id }).exec();
    const reviewsUser = await this.reviewsService.findAll({ user_id: user._id.toString() });
    for (const review of reviewsUser.results) {
      await this.reviewsService.deleteOne({ fields: ['_id'], fieldValue: review._id.toString() });
    }
    let deletedUser = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      deletedUser = await this.userModel.findOneAndRemove({ [field]: fieldValue }).exec();
      if (deletedUser) break;
    }
    if (!deletedUser) {
      throw new NotFoundException('User not deleted');
    }
    await this.uploadService.removeFolder(`users/${deletedUser._id}`);
    return user.toObject();
  }

  async uploadFiles({ fields, fieldValue, files }: { files: UserFiles } & OperationOptions<User>): Promise<User> {
    let user = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      user = await this.userModel.findOne({ [field]: fieldValue }).exec();
      if (user) break;
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const timeStamp = new Date().getTime();
    for (const file of files.flat()) {
      if (file.fieldname === 'avatar_file') {
        if (user.avatar !== '') {
          await this.uploadService.remove(getFilePath(user.avatar));
        }
        const res = await this.uploadService.upload(`users/${user._id}/avatar-${timeStamp}.${file.mimetype.split('/')[1]}`, file);
        user.avatar = res;
      }
      if (file.fieldname === 'cover_file') {
        if (user.cover !== '') {
          await this.uploadService.remove(getFilePath(user.cover));
        }
        const res = await this.uploadService.upload(`users/${user._id}/cover-${timeStamp}.${file.mimetype.split('/')[1]}`, file);
        user.cover = res;
      }
    }

    await user.save();
    return user.toObject();
  }
}
