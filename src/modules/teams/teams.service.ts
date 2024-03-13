import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import slugify from '@sindresorhus/slugify';
import mongoose, { Model } from 'mongoose';
import { OperationOptions } from '../../common/types/operation-options';
import { UploadService } from '../upload/upload.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindAllFilterTeamDto } from './dto/find-all-filter-team.dto';
import { UpdateMembersTeamDto } from './dto/update-members-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './schemas/team.schema';
import { FindAllReturnTeam } from './types/find-all-return-team';
import { TeamFiles } from './types/team-files';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
    private uploadService: UploadService,
  ) {}

  private generateSlug(name: string): string {
    return `${slugify(name, { decamelize: false })}`;
  }

  async createOne(createTeamDto: CreateTeamDto): Promise<Team> {
    const createdTeam = await this.teamModel.create(createTeamDto);
    createdTeam.slug = this.generateSlug(createdTeam.name);
    await createdTeam.save();
    return createdTeam.toObject();
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

  async findOne({ fields, fieldValue }: OperationOptions<Team>): Promise<Team> {
    let foundTeam = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      foundTeam = await this.teamModel.findOne({ [field]: fieldValue }).exec();
      if (foundTeam) break;
    }
    if (!foundTeam) {
      throw new NotFoundException('Team not found');
    }
    return foundTeam.toObject();
  }

  async updateOne({
    fields,
    fieldValue,
    updateDto,
  }: { updateDto: UpdateTeamDto } & OperationOptions<Team>): Promise<Team> {
    let updatedTeam = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      updatedTeam = await this.teamModel
        .findOneAndUpdate(
          { [field]: fieldValue },
          { $set: updateDto },
          {
            new: true,
          },
        )
        .exec();
      if (updatedTeam) break;
    }
    if (!updatedTeam) {
      throw new NotFoundException('Team not updated');
    }
    if (updateDto.name) {
      updatedTeam.slug = this.generateSlug(updatedTeam.name);
      await updatedTeam.save();
    }
    return updatedTeam.toObject();
  }

  async deleteOne({ fields, fieldValue }: OperationOptions<Team>): Promise<Team> {
    let deletedTeam = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      deletedTeam = await this.teamModel.findOneAndRemove({ [field]: fieldValue }).exec();
      if (deletedTeam) break;
    }
    if (!deletedTeam) {
      throw new NotFoundException('Team not deleted');
    }
    return deletedTeam.toObject();
  }

  async uploadFiles({ fields, fieldValue, files }: { files: TeamFiles } & OperationOptions<Team>): Promise<Team> {
    let team = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      team = await this.teamModel.findOne({ [field]: fieldValue }).exec();
      if (team) break;
    }
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    for (const file of files.flat()) {
      if (file.fieldname === 'logo_file') {
        const res = await this.uploadService.upload(`team-${team._id}-logo.${file.mimetype.split('/')[1]}`, file);
        team.logo = res;
      }
    }

    await team.save();
    return team.toObject();
  }

  async updateMembers({
    fields,
    fieldValue,
    updateMembersDto,
  }: { updateMembersDto: UpdateMembersTeamDto } & OperationOptions<Team>): Promise<Team> {
    let team = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      team = await this.teamModel.findOne({ [field]: fieldValue }).exec();
      if (team) break;
    }
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    let newMembers = team.members;
    for (const item of updateMembersDto.members) {
      if (item.action === 'add') {
        const memberIndex = team.members.findIndex((member) => member.user._id.toString() === item.member.user);
        if (memberIndex !== -1) {
          newMembers[memberIndex] = { user: new mongoose.Types.ObjectId(item.member.user), role: item.member.role };
        } else {
          newMembers.push({ user: new mongoose.Types.ObjectId(item.member.user), role: item.member.role });
        }
      } else if (item.action === 'remove') {
        const memberIndex = team.members.findIndex((member) => member.user._id.toString() === item.member.user);
        if (memberIndex !== -1) {
          newMembers = team.members.filter((member) => member.user._id.toString() !== item.member.user);
        }
      }
    }

    team = await this.teamModel
      .findOneAndUpdate(
        { _id: team._id },
        { $set: { members: newMembers } },
        {
          new: true,
        },
      )
      .exec();
    if (!team) {
      throw new NotFoundException('Team not updated');
    }
    return team.toObject();
  }
}
