import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import slugify from '@sindresorhus/slugify';
import { startOfToday, subDays, subMonths, subWeeks, subYears } from 'date-fns';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { OperationOptions } from '../../common/types/operation-options';
import { Review } from '../reviews/schemas/review.schema';
import { Tag } from '../tags/schemas/tag.schema';
import { UploadService } from '../upload/upload.service';
import { User } from '../users/schemas/user.schema';
import { Vote } from '../votes/schemas/vote.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { FindAllFilterProjectDto } from './dto/find-all-filter-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './schemas/project.schema';
import { FindAllReturnProject } from './types/find-all-return-project';
import { ProjectFiles } from './types/project-files';
import { ProjectTimeFrame } from './types/project-time-frame';
import { ReturnProject } from './types/return-project';
import { Reaction } from '../reactions/schemas/reaction.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    @InjectModel(Vote.name) private readonly voteModel: Model<Vote>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Tag.name) private readonly tagModel: Model<Tag>,
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @InjectModel(Reaction.name) private readonly reactionModel: Model<Reaction>,
    private uploadService: UploadService,
  ) {}

  private generateSlug(id: mongoose.Types.ObjectId, title: string): string {
    return `${slugify(title, { decamelize: false })}-${id}`;
  }

  async createOne(createProjectDto: CreateProjectDto): Promise<ReturnProject> {
    const createdProject = await this.projectModel.create(createProjectDto);
    createdProject.slug = this.generateSlug(createdProject._id, createdProject.title);
    await createdProject.save();
    return { ...createdProject.toObject(), voted: false };
  }

  async findAll({
    search = '',
    page = 1,
    limit = 20,
    order = '_id',
    time_frame = ProjectTimeFrame.All,
    tag_slug = '',
    status = '',
    creator_id = '',
    team_id = '',
    user_id = '',
  }: { user_id?: string } & FindAllFilterProjectDto): Promise<FindAllReturnProject> {
    const count = await this.projectModel.countDocuments().exec();
    const searchQuery = search !== '' ? { $text: { $search: search } } : {};
    const tag = tag_slug !== '' ? await this.tagModel.findOne({ slug: tag_slug }) : null;
    const tagSlugQuery = tag !== null ? { tags: tag._id } : {};
    const statusQuery = status !== '' ? { status: status } : {};
    const creatorQuery = creator_id !== '' ? { creator: creator_id } : {};
    const teamQuery = team_id !== '' ? { team: team_id } : {};
    let startDate: Date;
    switch (time_frame) {
      case 'day':
        startDate = subDays(startOfToday(), 1);
        break;
      case 'week':
        startDate = subWeeks(startOfToday(), 1);
        break;
      case 'month':
        startDate = subMonths(startOfToday(), 1);
        break;
      case 'year':
        startDate = subYears(startOfToday(), 1);
        break;
      default:
        startDate = new Date(0);
        break;
    }
    let foundProjects = await this.projectModel
      .find({
        ...searchQuery,
        ...tagSlugQuery,
        ...statusQuery,
        ...creatorQuery,
        ...teamQuery,
        created_at: { $gte: startDate },
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [order[0] === '!' ? order.slice(1) : order]: order[0] === '!' ? -1 : 1 })
      .exec();
    const resultProjects = foundProjects.map(async (project) => {
      const vote = user_id !== '' ? await this.voteModel.findOne({ project: project._id, voter: user_id }).exec() : null;
      return { ...project.toObject(), voted: vote ? true : false };
    });
    return {
      filter: {
        page,
        limit,
        search,
        order,
        time_frame,
        tag_slug,
        status,
        creator_id,
        team_id,
      },
      info: {
        find_count: foundProjects.length,
        total_count: count,
        count_pages: Math.ceil(count / limit),
      },
      results: await Promise.all(resultProjects),
    };
  }

  async findOne({ fields, fieldValue, user_id = '' }: { user_id?: string } & OperationOptions<Project>): Promise<ReturnProject> {
    let foundProject = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      foundProject = await this.projectModel.findOne({ [field]: fieldValue }).exec();
      if (foundProject) break;
    }
    if (!foundProject) {
      throw new NotFoundException('Project not found');
    }
    const vote = user_id !== '' ? await this.voteModel.findOne({ project: foundProject._id, voter: user_id }).exec() : null;
    return { ...foundProject.toObject(), voted: vote ? true : false };
  }

  async updateOne({
    fields,
    fieldValue,
    user_id = '',
    updateDto,
  }: { user_id?: string; updateDto: UpdateProjectDto } & OperationOptions<Project>): Promise<ReturnProject> {
    let updatedProject = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      updatedProject = await this.projectModel
        .findOneAndUpdate(
          { [field]: fieldValue },
          { $set: updateDto },
          {
            new: true,
          },
        )
        .exec();
      if (updatedProject) break;
    }
    if (!updatedProject) {
      throw new NotFoundException('Project not updated');
    }
    if (updateDto.title) {
      updatedProject.slug = this.generateSlug(updatedProject._id, updatedProject.title);
      await updatedProject.save();
    }
    const vote = user_id !== '' ? await this.voteModel.findOne({ project: updatedProject._id, voter: user_id }).exec() : null;
    return { ...updatedProject.toObject(), voted: vote ? true : false };
  }

  async deleteOne({ fields, fieldValue }: OperationOptions<Project>): Promise<ReturnProject> {
    let deletedProject = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      deletedProject = await this.projectModel.findOneAndRemove({ [field]: fieldValue }).exec();
      if (deletedProject) break;
    }
    if (!deletedProject) {
      throw new NotFoundException('Project not deleted');
    }
    await this.voteModel.deleteMany({ project: deletedProject._id }).exec();
    const reviewsProject = await this.reviewModel.find({ project: deletedProject._id }).exec();
    await this.reactionModel.deleteMany({ review: { $in: reviewsProject.map((review) => review._id) } }).exec();
    await this.reviewModel.deleteMany({ project: deletedProject._id }).exec();
    if (deletedProject.logo) {
      await this.uploadService.remove(deletedProject.logo.split('/').slice(-1)[0]);
    }
    if (deletedProject.screenshots.length > 0) {
      for (const screenshot of deletedProject.screenshots) {
        await this.uploadService.remove(screenshot.split('/').slice(-1)[0]);
      }
    }
    return { ...deletedProject.toObject(), voted: false };
  }

  async uploadFiles({
    fields,
    fieldValue,
    user_id = '',
    files,
  }: { user_id?: string; files: ProjectFiles } & OperationOptions<Project>): Promise<ReturnProject> {
    let project = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      project = await this.projectModel.findOne({ [field]: fieldValue }).exec();
      if (project) break;
    }
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    let index = 0;
    for (const file of files.flat()) {
      if (file.fieldname === 'logo_file') {
        const res = await this.uploadService.upload(`project-${project._id}-logo.${file.mimetype.split('/')[1]}`, file);
        project.logo = res;
      } else if (file.fieldname === 'screenshots_files') {
        if (index === 0) {
          for (const screenshot of project.screenshots) {
            await this.uploadService.remove(screenshot.split('/').slice(-1)[0]);
          }
          project.screenshots = [];
        }
        const res = await this.uploadService.upload(`project-${project._id}-screenshot-${index}.${file.mimetype.split('/')[1]}`, file);
        project.screenshots.push(res);
        index += 1;
      }
    }

    await project.save();
    const vote = user_id !== '' ? await this.voteModel.findOne({ project: project._id, voter: user_id }).exec() : null;
    return { ...project.toObject(), voted: vote ? true : false };
  }

  async voteOne({ fields, fieldValue, voter_id }: { voter_id: string } & OperationOptions<Project>): Promise<ReturnProject> {
    let project = null;
    for (const field of fields) {
      if (field === '_id' && !mongoose.Types.ObjectId.isValid(fieldValue)) continue;
      project = await this.projectModel.findOne({ [field]: fieldValue }).exec();
      if (project) break;
    }
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const user = await this.userModel.findOne({ _id: voter_id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const vote = await this.voteModel.findOne({
      project: project._id,
      voter: user._id,
    });
    if (vote) {
      await this.voteModel.deleteOne({
        _id: vote._id,
      });
      project.flames -= 1;
    } else {
      await this.voteModel.create({
        project: project._id,
        voter: user._id,
      });
      project.flames += 1;
    }

    await project.save();
    return { ...project.toObject(), voted: vote ? false : true };
  }
}
