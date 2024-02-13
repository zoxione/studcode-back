import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindAllFilterTeamDto } from './dto/find-all-filter-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './schemas/team.schema';
import { FindAllReturnTeam } from './types/find-all-return-team';

@Injectable()
export class TeamsService {
  constructor(@InjectModel(Team.name) private readonly teamModel: Model<Team>) {}

  async createOne(createTeamDto: CreateTeamDto): Promise<Team> {
    const createdTeam = await this.teamModel.create(createTeamDto);
    return createdTeam;
  }

  async findAll({
    search = '',
    page = 1,
    limit = 20,
    order = '_id',
  }: FindAllFilterTeamDto): Promise<FindAllReturnTeam> {
    const count = await this.teamModel.countDocuments().exec();
    const searchQuery = search !== '' ? { $text: { $search: search } } : {};
    const foundTeams = await this.teamModel
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
        foundTeam = await this.teamModel.findOne({ _id: fieldValue }).exec();
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
        deletedTeam = await this.teamModel.findByIdAndRemove({ _id: fieldValue }).exec();
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
