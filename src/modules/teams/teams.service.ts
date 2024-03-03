import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindAllFilterTeamDto } from './dto/find-all-filter-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './schemas/team.schema';
import { FindAllReturnTeam } from './types/find-all-return-team';
import { UpdateMembersTeamDto } from './dto/update-members-team.dto';
import { TeamMember } from './schemas/team-member.schema';

@Injectable()
export class TeamsService {
  private readonly populations = [{ path: 'members.user', select: '_id username avatar full_name' }];

  constructor(@InjectModel(Team.name) private readonly teamModel: Model<Team>) {}

  private updateMembers(newMembers: TeamMember[], updateDto: UpdateMembersTeamDto): TeamMember[] {
    updateDto.members.forEach((item) => {
      if (item.action === 'add') {
        if (!newMembers.some((member) => member.user.toString() === item.payload.user)) {
          newMembers.push({ user: new mongoose.Types.ObjectId(item.payload.user), role: item.payload.role });
        }
      } else if (item.action === 'remove') {
        if (newMembers.some((member) => member.user.toString() === item.payload.user)) {
          newMembers = newMembers.filter((member) => member.user.toString() !== item.payload.user);
        }
      }
    });
    return newMembers;
  }

  async createOne(createTeamDto: CreateTeamDto): Promise<Team> {
    const createdTeam = await this.teamModel.create(createTeamDto);
    return createdTeam;
  }

  async findAll({
    search = '',
    page = 1,
    limit = 20,
    order = '_id',
    member_id = '',
  }: FindAllFilterTeamDto): Promise<FindAllReturnTeam> {
    const count = await this.teamModel.countDocuments().exec();
    const searchQuery = search !== '' ? { $text: { $search: search } } : {};
    const memberQuery = member_id !== '' ? { 'members.user': member_id } : {};
    const foundTeams = await this.teamModel
      .find({ ...searchQuery, ...memberQuery })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate(this.populations)
      .sort({ [order]: order[0] === '!' ? -1 : 1 })
      .exec();
    return {
      filter: {
        page,
        limit,
        search,
        order,
        member_id,
      },
      info: {
        find_count: foundTeams.length,
        total_count: count,
        count_pages: Math.ceil(count / limit),
      },
      results: foundTeams,
    };
  }

  async findOne(field: keyof Team, fieldValue: unknown): Promise<Team>;
  async findOne(
    field: keyof Team,
    fieldValue: unknown,
    options: {
      throw?: true;
    },
  ): Promise<Team>;
  async findOne(
    field: keyof Team,
    fieldValue: unknown,
    options: {
      throw?: false;
    },
  ): Promise<Team | null>;
  async findOne(
    field: keyof Team,
    fieldValue: unknown,
    options: {
      throw?: boolean;
    } = { throw: true },
  ): Promise<Team | null> {
    let foundTeam: Team | null = null;
    switch (field) {
      case '_id': {
        if (mongoose.Types.ObjectId.isValid(fieldValue as string)) {
          foundTeam = await this.teamModel.findOne({ _id: fieldValue }).populate(this.populations).exec();
        }
        break;
      }
      case 'name': {
        foundTeam = await this.teamModel.findOne({ name: fieldValue }).populate(this.populations).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!foundTeam && options.throw) {
      throw new NotFoundException('Team Not Found');
    }
    return foundTeam;
  }

  async updateOne(field: keyof Team, fieldValue: unknown, updateDto: Partial<UpdateTeamDto>): Promise<Team>;
  async updateOne(
    field: keyof Team,
    fieldValue: unknown,
    updateDto: Partial<UpdateTeamDto>,
    options: {
      throw?: true;
    },
  ): Promise<Team>;
  async updateOne(
    field: keyof Team,
    fieldValue: unknown,
    updateDto: Partial<UpdateTeamDto>,
    options: {
      throw?: false;
    },
  ): Promise<Team | null>;
  async updateOne(
    field: keyof Team,
    fieldValue: unknown,
    updateDto: Partial<UpdateTeamDto>,
    options: {
      throw?: boolean;
    } = { throw: true },
  ): Promise<Team | null> {
    let updatedTeam: Team | null = null;
    switch (field) {
      case '_id': {
        updatedTeam = await this.teamModel
          .findOneAndUpdate({ _id: fieldValue }, updateDto, {
            new: true,
          })
          .populate(this.populations)
          .exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!updatedTeam && options.throw) {
      throw new NotFoundException('Team Not Updated');
    }
    return updatedTeam;
  }

  async updateMembersOne(field: keyof Team, fieldValue: unknown, updateDto: UpdateMembersTeamDto): Promise<Team>;
  async updateMembersOne(
    field: keyof Team,
    fieldValue: unknown,
    updateDto: UpdateMembersTeamDto,
    options: {
      throw?: true;
    },
  ): Promise<Team>;
  async updateMembersOne(
    field: keyof Team,
    fieldValue: unknown,
    updateDto: UpdateMembersTeamDto,
    options: {
      throw?: false;
    },
  ): Promise<Team | null>;
  async updateMembersOne(
    field: keyof Team,
    fieldValue: unknown,
    updateDto: UpdateMembersTeamDto,
    options: {
      throw?: boolean;
    } = { throw: true },
  ): Promise<Team | null> {
    let updatedTeam: Team | null = null;
    switch (field) {
      case '_id': {
        if (mongoose.Types.ObjectId.isValid(fieldValue as string)) {
          updatedTeam = await this.teamModel.findOne({ _id: fieldValue }).exec();
          if (!updatedTeam) {
            break;
          }
          updatedTeam = await this.teamModel
            .findOneAndUpdate(
              { _id: fieldValue },
              { members: this.updateMembers(updatedTeam.members, updateDto) },
              {
                new: true,
              },
            )
            .populate(this.populations)
            .exec();
        }
        break;
      }
      case 'name': {
        updatedTeam = await this.teamModel.findOne({ name: fieldValue }).exec();
        if (!updatedTeam) {
          break;
        }
        updatedTeam = await this.teamModel
          .findOneAndUpdate(
            { name: fieldValue },
            { members: this.updateMembers(updatedTeam.members, updateDto) },
            {
              new: true,
            },
          )
          .populate(this.populations)
          .exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!updatedTeam && options.throw) {
      throw new NotFoundException('Team Not Updated');
    }
    return updatedTeam;
  }

  async deleteOne(field: keyof Team, fieldValue: unknown): Promise<Team>;
  async deleteOne(
    field: keyof Team,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: true;
    },
  ): Promise<Team>;
  async deleteOne(
    field: keyof Team,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: false;
    },
  ): Promise<Team | null>;
  async deleteOne(
    field: keyof Team,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: boolean;
    } = { secret: false, throw: true },
  ): Promise<Team | null> {
    let deletedTeam: Team | null = null;
    switch (field) {
      case '_id': {
        deletedTeam = await this.teamModel.findByIdAndRemove({ _id: fieldValue }).populate(this.populations).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!deletedTeam && options.throw) {
      throw new NotFoundException('Team Not Deleted');
    }
    return deletedTeam;
  }
}
