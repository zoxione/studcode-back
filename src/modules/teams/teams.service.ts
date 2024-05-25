import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import slugify from '@sindresorhus/slugify';
import mongoose, { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { OperationOptions } from '../../common/types/operation-options';
import { convertIncorrectKeyboard } from '../../common/utils/convert-incorrect-keyboard';
import { getFilePath } from '../../common/utils/get-file-path';
import configuration from '../../config/configuration';
import { Project } from '../projects/schemas/project.schema';
import { Token } from '../tokens/schemas/token.schema';
import { TokenEvent } from '../tokens/types/token-event';
import { UploadService } from '../upload/upload.service';
import { User } from '../users/schemas/user.schema';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindAllFilterTeamDto } from './dto/find-all-filter-team.dto';
import { FindOneFilterTeamDto } from './dto/find-one-filter-team.dto';
import { UpdateTeamMembersDto } from './dto/update-team-members.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './schemas/team.schema';
import { FindAllReturnTeam } from './types/find-all-return-team';
import { TeamAction } from './types/team-action';
import { TeamFiles } from './types/team-files';
import { TeamMemberRole } from './types/team-member-role';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private uploadService: UploadService,
    private readonly mailerService: MailerService,
  ) {}

  private generateSlug(name: string): string {
    return `${slugify(name, { decamelize: false })}`;
  }

  private async sendEmailInvitedUser(userId: string, team: Team): Promise<void> {
    const user = await this.userModel.findOne({ _id: userId }).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const randomToken = uuidv4();
    await this.tokenModel.create({
      event: TokenEvent.TeamInvite,
      content: randomToken,
      user: user._id,
    });
    const link = `${configuration().app_url}/api/v1/teams/${team._id}/members/accept?token=${randomToken}`;
    await this.mailerService.sendMail({
      from: `"Студенческий Код" <${configuration().smtp_mail}>`,
      to: user.email,
      subject: `Приглашение в команду ${team.name} на сайте ${configuration().frontend_url}`,
      html: `
          <div>
            <h1>Приглашение в команду ${team.name} на сайте ${configuration().frontend_url}</h1>
            <p>Для подтверждения приглашения перейдите по ссылке:</p>
            <a href="${link}" target="_blank">${link}</a>
            <p>С уважением, команда Студенческого Кода.</p>
          </div>
        `,
    });
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
    member_role = '',
  }: FindAllFilterTeamDto): Promise<FindAllReturnTeam> {
    const count = await this.teamModel.countDocuments().exec();
    const searchQuery = search !== '' ? { name: { $in: convertIncorrectKeyboard(search) } } : {};
    const memberQuery = member_id !== '' ? { 'members.user': member_id } : {};
    const memberRoleQuery =
      member_role !== ''
        ? member_role[0] === '!'
          ? { members: { $not: { $elemMatch: { user: member_id, role: member_role.slice(1) } } } }
          : { members: { $elemMatch: { user: member_id, role: member_role } } }
        : {};
    const foundTeams = await this.teamModel
      .find({ ...searchQuery, ...memberQuery, ...memberRoleQuery })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [order[0] === '!' ? order.slice(1) : order]: order[0] === '!' ? -1 : 1 })
      .exec();
    const foundTeamsFiltered = foundTeams;
    for (let i = 0; i < foundTeamsFiltered.length; i++) {
      let membersFiltered = foundTeamsFiltered[i].members;
      if (member_role !== '') {
        membersFiltered =
          member_role[0] === '!'
            ? foundTeamsFiltered[i].members.filter((member) => member.role !== member_role.slice(1))
            : foundTeamsFiltered[i].members.filter((member) => member.role === member_role);
      }
      foundTeamsFiltered[i].members = membersFiltered;
    }
    return {
      filter: {
        page,
        limit,
        search,
        order,
        member_id,
        member_role,
      },
      info: {
        find_count: foundTeams.length,
        total_count: count,
        count_pages: Math.ceil(count / limit),
      },
      results: foundTeamsFiltered,
    };
  }

  async findOne({ fields, fieldValue, filter }: { filter: FindOneFilterTeamDto } & OperationOptions<Team>): Promise<Team> {
    let foundTeam = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      foundTeam = await this.teamModel.findOne({ [field]: fieldValue }).exec();
      if (foundTeam) break;
    }
    if (!foundTeam) {
      throw new NotFoundException('Team not found');
    }
    let membersFiltered = foundTeam.members;
    if (filter.member_role) {
      membersFiltered =
        filter.member_role[0] === '!'
          ? foundTeam.members.filter((member) => member.role !== filter.member_role?.slice(1))
          : foundTeam.members.filter((member) => member.role === filter.member_role);
    }
    const { members, ...team } = foundTeam.toObject();
    return { ...team, members: membersFiltered };
  }

  async updateOne({ fields, fieldValue, updateDto }: { updateDto: UpdateTeamDto } & OperationOptions<Team>): Promise<Team> {
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
    await this.projectModel.updateMany({ team: deletedTeam._id }, { $set: { team: null } }).exec();
    await this.uploadService.removeFolder(`teams/${deletedTeam._id}`);
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

    const timeStamp = new Date().getTime();
    for (const file of files.flat()) {
      if (file.fieldname === 'logo_file') {
        if (team.logo !== '') {
          await this.uploadService.remove(getFilePath(team.logo));
        }
        const res = await this.uploadService.upload(`teams/${team._id}/logo-${timeStamp}.${file.mimetype.split('/')[1]}`, file);
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
  }: { updateMembersDto: UpdateTeamMembersDto } & OperationOptions<Team>): Promise<Team> {
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
    if (updateMembersDto.action === TeamAction.Add) {
      const newMember = { user: new mongoose.Types.ObjectId(updateMembersDto.member.user), role: updateMembersDto.member.role };
      const memberIndex = team.members.findIndex((member) => member.user._id.toString() === updateMembersDto.member.user);
      if (memberIndex !== -1) {
        if (team.members[memberIndex].role !== TeamMemberRole.Invited) {
          // если уже есть и не приглашен, то просто обновим
          newMembers[memberIndex] = newMember;
        } else {
          // если уже есть и приглашен, то просто отправим повторное приглашение
          const token = await this.tokenModel.findOne({
            event: TokenEvent.TeamInvite,
            user: newMember.user._id,
          });
          if (!token) {
            await this.sendEmailInvitedUser(newMember.user._id.toString(), team);
          }
        }
      } else {
        // если нет, то пригласим
        await this.sendEmailInvitedUser(newMember.user._id.toString(), team);
        const { role: newMemberRole, ...newMemberInvited } = newMember;
        newMembers.push({ role: TeamMemberRole.Invited, ...newMemberInvited });
      }
    } else if (updateMembersDto.action === TeamAction.Remove) {
      const memberIndex = team.members.findIndex((member) => member.user._id.toString() === updateMembersDto.member.user);
      if (memberIndex !== -1) {
        // если нашли, то удалим
        newMembers = team.members.filter((member) => member.user._id.toString() !== updateMembersDto.member.user);
        if (team.members[memberIndex].role === TeamMemberRole.Invited) {
          // если приглашен, то удалим токен
          await this.tokenModel.deleteMany({
            event: TokenEvent.TeamInvite,
            user: team.members[memberIndex].user._id,
          });
        }
      }
    }

    if (newMembers.length === 0) {
      team = await this.deleteOne({ fields: ['_id'], fieldValue: team._id.toString() });
      return team;
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

  async join({ fields, fieldValue, userId }: { userId: string } & OperationOptions<Team>): Promise<Team> {
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
    const newMember = { user: new mongoose.Types.ObjectId(userId), role: TeamMemberRole.Member };
    const memberIndex = team.members.findIndex((member) => member.user._id.toString() === userId);
    if (memberIndex === -1) {
      // если не нашли, то добавим
      newMembers.push(newMember);
      await this.tokenModel.deleteMany({ event: TokenEvent.TeamInvite, user: userId });
    } else if (team.members[memberIndex].role === TeamMemberRole.Invited) {
      // если нашли и приглашен, то просто обновим
      newMembers[memberIndex] = newMember;
      await this.tokenModel.deleteMany({ event: TokenEvent.TeamInvite, user: userId });
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

  async leave({ fields, fieldValue, userId }: { userId: string } & OperationOptions<Team>): Promise<Team> {
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
    const memberIndex = team.members.findIndex((member) => member.user._id.toString() === userId);
    if (memberIndex !== -1) {
      // если нашли, то удалим
      newMembers = team.members.filter((member) => member.user._id.toString() !== userId);
    }

    if (newMembers.length === 0) {
      team = await this.deleteOne({ fields: ['_id'], fieldValue: team._id.toString() });
      return team;
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
