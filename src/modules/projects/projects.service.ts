import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { startOfToday, subDays, subMonths, subWeeks, subYears } from 'date-fns';
import { Model } from 'mongoose';
import { TagsService } from '../tags/tags.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { FindAllQueryProjectDto } from './dto/find-all-query-project.dto';
import { FindAllReturnProjectDto } from './dto/find-all-return-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './schemas/project.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    private tagsService: TagsService,
  ) {}

  async createOne(createProjectDto: CreateProjectDto): Promise<Project> {
    const createdProject = await this.projectModel.create(createProjectDto);
    await createdProject.populate({ path: 'tags', select: '_id name icon' });
    await createdProject.populate({ path: 'creator', select: '_id username avatar' });
    return createdProject;
  }

  async findAll({
    search = '',
    page = 0,
    limit = 20,
    time_frame = 'all',
    tag_slug = '',
    creator_id = '',
  }: FindAllQueryProjectDto): Promise<FindAllReturnProjectDto> {
    const count = await this.projectModel.countDocuments().exec();
    const searchQuery = search !== '' ? { $text: { $search: search } } : {};
    const tag = tag_slug !== '' ? await this.tagsService.findOne('slug', tag_slug) : null;
    const tagSlugQuery = tag !== null ? { tags: tag._id } : {};
    const creatorQuery = creator_id !== '' ? { creator: creator_id } : {};
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
    const foundProjects = await this.projectModel
      .find({
        ...searchQuery,
        ...tagSlugQuery,
        ...creatorQuery,
        created_at: { $gte: startDate },
      })
      .skip(page * limit)
      .limit(limit)
      .populate({ path: 'tags', select: '_id name icon slug' })
      .populate({
        path: 'creator',
        select: '_id username avatar',
      })
      .exec();
    return {
      stats: {
        page,
        limit,
        search,
        time_frame,
        find_count: foundProjects.length,
        total_count: count,
        count_pages: Math.ceil(count / limit),
      },
      data: foundProjects,
    };
  }

  async findOne(field: keyof Project, fieldValue: unknown): Promise<Project> {
    let foundProject: Project | null = null;
    switch (field) {
      case '_id': {
        foundProject = await this.projectModel
          .findOne({ _id: fieldValue })
          .populate({ path: 'tags', select: '_id name icon' })
          .populate({
            path: 'creator',
            select: '_id username avatar',
          })
          .exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!foundProject) {
      throw new NotFoundException('Project Not Found');
    }
    return foundProject;
  }

  async updateOne(field: keyof Project, fieldValue: unknown, updateDto: Partial<UpdateProjectDto>): Promise<Project> {
    let updatedProject: Project | null = null;
    switch (field) {
      case '_id': {
        updatedProject = await this.projectModel
          .findOneAndUpdate({ _id: fieldValue }, updateDto, {
            new: true,
          })
          .populate({ path: 'tags', select: '_id name icon' })
          .populate({
            path: 'creator',
            select: '_id username avatar',
          })
          .exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!updatedProject) {
      throw new NotFoundException('Project Not Updated');
    }
    return updatedProject;
  }

  async deleteOne(field: keyof Project, fieldValue: unknown): Promise<Project> {
    let deletedProject: Project | null = null;
    switch (field) {
      case '_id': {
        deletedProject = await this.projectModel
          .findByIdAndRemove({ _id: fieldValue })
          .populate({ path: 'tags', select: '_id name icon' })
          .populate({
            path: 'creator',
            select: '_id username avatar',
          })
          .exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!deletedProject) {
      throw new NotFoundException('Project Not Deleted');
    }
    return deletedProject;
  }
}
