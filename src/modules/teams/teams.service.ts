import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { FindAllReturnDto } from '../../common/dto/find-all-return.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './schemas/team.schema';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(@InjectModel(Team.name) private readonly teamModel: Model<Team>) {}

  async createOne(createTeamDto: CreateTeamDto): Promise<Team> {
    const createdTeam = await this.teamModel.create(createTeamDto);
    return createdTeam;
  }

  async findAll({ search = '', page = 0, limit = 20 }: FindAllQueryDto): Promise<FindAllReturnDto> {
    const count = await this.teamModel.countDocuments().exec();
    const searchQuery = search !== '' ? { $text: { $search: search } } : {};
    const foundTeams = await this.teamModel
      .find(searchQuery)
      .skip(page * limit)
      .limit(limit)
      .exec();
    return { stats: { totalCount: count }, data: foundTeams };
  }

  async findOne(field: keyof Team, fieldValue: unknown): Promise<Team> {
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
    if (!foundTeam) {
      throw new NotFoundException('Team Not Found');
    }
    return foundTeam;
  }

  async updateOne(field: keyof Team, fieldValue: unknown, updateDto: Partial<UpdateTeamDto>): Promise<Team> {
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
    if (!updatedTeam) {
      throw new NotFoundException('Team Not Updated');
    }
    return updatedTeam;
  }

  async deleteOne(field: keyof Team, fieldValue: unknown): Promise<Team> {
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
    if (!deletedTeam) {
      throw new NotFoundException('Team Not Deleted');
    }
    return deletedTeam;
  }
}
