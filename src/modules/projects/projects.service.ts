import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { startOfToday, subDays, subMonths, subWeeks, subYears } from 'date-fns';
import { Model } from 'mongoose';
import { TagsService } from '../tags/tags.service';
import { VotesService } from '../votes/votes.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { FindAllFilterProjectDto } from './dto/find-all-filter-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './schemas/project.schema';
import { FindAllReturnProject } from './types/find-all-return-project';

@Injectable()
export class ProjectsService {
  private readonly populations = [
    { path: 'tags', select: '_id name icon slug' },
    { path: 'creator', select: '_id username avatar full_name' },
  ];

  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    private tagsService: TagsService,
    private votesService: VotesService,
  ) {}

  async createOne(createProjectDto: CreateProjectDto): Promise<Project> {
    const createdProject = await this.projectModel.create(createProjectDto);
    await createdProject.populate(this.populations);
    return createdProject;
  }

  async findAll({
    search = '',
    page = 1,
    limit = 20,
    order = '_id',
    time_frame = 'all',
    tag_slug = '',
    creator_id = '',
    status = '',
  }: FindAllFilterProjectDto): Promise<FindAllReturnProject> {
    const count = await this.projectModel.countDocuments().exec();
    const searchQuery = search !== '' ? { $text: { $search: search } } : {};
    const tag = tag_slug !== '' ? await this.tagsService.findOne('slug', tag_slug) : null;
    const tagSlugQuery = tag !== null ? { tags: tag._id } : {};
    const creatorQuery = creator_id !== '' ? { creator: creator_id } : {};
    const statusQuery = status !== '' ? { status: status } : {};
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
        ...statusQuery,
        created_at: { $gte: startDate },
      })
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
        time_frame,
        tag_slug,
        creator_id,
        status,
      },
      info: {
        find_count: foundProjects.length,
        total_count: count,
        count_pages: Math.ceil(count / limit),
      },
      results: foundProjects,
    };
  }

  async findOne(field: keyof Project, fieldValue: unknown): Promise<Project>;
  async findOne(
    field: keyof Project,
    fieldValue: unknown,
    options: {
      throw?: true;
    },
  ): Promise<Project>;
  async findOne(
    field: keyof Project,
    fieldValue: unknown,
    options: {
      throw?: false;
    },
  ): Promise<Project | null>;
  async findOne(
    field: keyof Project,
    fieldValue: unknown,
    options: {
      throw?: boolean;
    } = { throw: true },
  ): Promise<Project | null> {
    let foundProject: Project | null = null;
    switch (field) {
      case '_id': {
        foundProject = await this.projectModel.findOne({ _id: fieldValue }).populate(this.populations).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!foundProject && options.throw) {
      throw new NotFoundException('Project Not Found');
    }
    return foundProject;
  }

  async updateOne(field: keyof Project, fieldValue: unknown, updateDto: Partial<UpdateProjectDto>): Promise<Project>;
  async updateOne(
    field: keyof Project,
    fieldValue: unknown,
    updateDto: Partial<UpdateProjectDto>,
    options: {
      throw?: true;
    },
  ): Promise<Project>;
  async updateOne(
    field: keyof Project,
    fieldValue: unknown,
    updateDto: Partial<UpdateProjectDto>,
    options: {
      throw?: false;
    },
  ): Promise<Project | null>;
  async updateOne(
    field: keyof Project,
    fieldValue: unknown,
    updateDto: Partial<UpdateProjectDto>,
    options: {
      throw?: boolean;
    } = { throw: true },
  ): Promise<Project | null> {
    let updatedProject: Project | null = null;
    switch (field) {
      case '_id': {
        updatedProject = await this.projectModel
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
    if (!updatedProject && options.throw) {
      throw new NotFoundException('Project Not Updated');
    }
    return updatedProject;
  }

  async voteOne(project_id: string, voter_id: string): Promise<Project>;
  async voteOne(
    project_id: string,
    voter_id: string,
    options: {
      throw?: true;
    },
  ): Promise<Project>;
  async voteOne(
    project_id: string,
    voter_id: string,
    options: {
      throw?: false;
    },
  ): Promise<Project | null>;
  async voteOne(
    project_id: string,
    voter_id: string,
    options: {
      throw?: boolean;
    } = { throw: true },
  ): Promise<Project | null> {
    const project = await this.projectModel.findOne({ _id: project_id });
    if (!project) {
      throw new NotFoundException('Project Not Found');
    }
    try {
      const vote = await this.votesService.findOne('project', project._id);
      throw new ConflictException(`Project with id ${voter_id} already voted`);
    } catch (e) {
      if (e.response.error === 'Not Found') {
        await this.votesService.createOne({ project: project_id, voter: voter_id });
        const updatedProject = await this.projectModel
          .findOneAndUpdate(
            { _id: project_id },
            { flames: project.flames + 1 },
            {
              new: true,
            },
          )
          .populate(this.populations)
          .exec();
        if (!updatedProject && options.throw) {
          throw new NotFoundException('Project Not Updated');
        }
        return updatedProject;
      } else {
        throw e;
      }
    }
  }

  async deleteOne(field: keyof Project, fieldValue: unknown): Promise<Project>;
  async deleteOne(
    field: keyof Project,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: true;
    },
  ): Promise<Project>;
  async deleteOne(
    field: keyof Project,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: false;
    },
  ): Promise<Project | null>;
  async deleteOne(
    field: keyof Project,
    fieldValue: unknown,
    options: {
      secret?: boolean;
      throw?: boolean;
    } = { secret: false, throw: true },
  ): Promise<Project | null> {
    let deletedProject: Project | null = null;
    switch (field) {
      case '_id': {
        deletedProject = await this.projectModel
          .findByIdAndRemove({ _id: fieldValue })
          .populate(this.populations)
          .exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!deletedProject && options.throw) {
      throw new NotFoundException('Project Not Deleted');
    }
    return deletedProject;
  }
}
