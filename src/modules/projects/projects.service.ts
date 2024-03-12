import slugify from '@sindresorhus/slugify';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { startOfToday, subDays, subMonths, subWeeks, subYears } from 'date-fns';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { TagsService } from '../tags/tags.service';
import { UploadService } from '../upload/upload.service';
import { VotesService } from '../votes/votes.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { FindAllFilterProjectDto } from './dto/find-all-filter-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './schemas/project.schema';
import { FindAllReturnProject } from './types/find-all-return-project';
import { ProjectFiles } from './types/project-files';
import { ProjectTimeFrame } from './types/project-time-frame';
import { Vote } from '../votes/schemas/vote.schema';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ProjectsService {
  private readonly populations = [
    { path: 'tags', select: '_id name icon slug' },
    { path: 'creator', select: '_id username avatar full_name' },
  ];

  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    @InjectModel(Vote.name) private readonly voteModel: Model<Vote>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private tagsService: TagsService,
    private uploadService: UploadService,
  ) {}

  private generateSlug(id: mongoose.Types.ObjectId, title: string): string {
    return `${slugify(title, { decamelize: false })}-${id}`;
  }

  async createOne(createProjectDto: CreateProjectDto): Promise<Project> {
    const createdProject = await this.projectModel.create(createProjectDto);
    const updatedProject = await this.projectModel
      .findByIdAndUpdate(
        { _id: createdProject._id },
        { $set: { slug: this.generateSlug(createdProject._id, createdProject.title) } },
        { new: true },
      )
      .populate(this.populations)
      .exec();
    return updatedProject as Project;
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
  }: FindAllFilterProjectDto): Promise<FindAllReturnProject> {
    const count = await this.projectModel.countDocuments().exec();
    const searchQuery = search !== '' ? { $text: { $search: search } } : {};
    const tag = tag_slug !== '' ? await this.tagsService.findOne('slug', tag_slug) : null;
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
    const foundProjects = await this.projectModel
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
        status,
        creator_id,
        team_id,
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
        if (mongoose.Types.ObjectId.isValid(fieldValue as string)) {
          foundProject = await this.projectModel.findOne({ _id: fieldValue }).populate(this.populations).exec();
        }
        break;
      }
      case 'slug': {
        foundProject = await this.projectModel.findOne({ slug: fieldValue }).populate(this.populations).exec();
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
        if (mongoose.Types.ObjectId.isValid(fieldValue as string)) {
          updatedProject = await this.projectModel
            .findOneAndUpdate(
              { _id: fieldValue },
              { $set: updateDto },
              {
                new: true,
              },
            )
            .populate(this.populations)
            .exec();
        }
        break;
      }
      case 'slug': {
        updatedProject = await this.projectModel
          .findOneAndUpdate(
            { slug: fieldValue },
            { $set: updateDto },
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
    if (!updatedProject && options.throw) {
      throw new NotFoundException('Project Not Updated');
    }
    if (updatedProject && updateDto.title) {
      updatedProject = await this.projectModel
        .findOneAndUpdate(
          { _id: updatedProject._id },
          { $set: { slug: this.generateSlug(updatedProject._id, updatedProject.title) } },
          {
            new: true,
          },
        )
        .populate(this.populations)
        .exec();
    }
    return updatedProject;
  }

  async uploadFiles(project_id: mongoose.Types.ObjectId, files: ProjectFiles): Promise<Project> {
    const projectFiles: Partial<Pick<Project, 'logo' | 'screenshots'>> = {};
    let index = 0;
    for (const file of files.flat()) {
      if (file.fieldname === 'logo_file') {
        const res = await this.uploadService.upload(`project-${project_id}-logo.${file.mimetype.split('/')[1]}`, file);
        projectFiles.logo = res;
      } else if (file.fieldname === 'screenshots_files') {
        const res = await this.uploadService.upload(
          `project-${project_id}-screenshot-${index}.${file.mimetype.split('/')[1]}`,
          file,
        );
        if (!projectFiles.screenshots) {
          projectFiles.screenshots = [];
        }
        projectFiles.screenshots.push(res);
        index += 1;
      }
    }
    const updatedProject = await this.updateOne('_id', project_id, {
      ...projectFiles,
    });
    return updatedProject;
  }

  async voteOne(field: keyof Project, fieldValue: unknown, voter_id: string): Promise<Project> {
    let project;
    switch (field) {
      case '_id': {
        if (mongoose.Types.ObjectId.isValid(fieldValue as string)) {
          project = await this.projectModel.findOne({ _id: fieldValue }).populate(this.populations).exec();
        }
        break;
      }
      case 'slug': {
        project = await this.projectModel.findOne({ slug: fieldValue }).populate(this.populations).exec();
        break;
      }
      default: {
        break;
      }
    }
    if (!project) {
      throw new NotFoundException('Project Not Found');
    }

    const user = await this.userModel.findOne({ _id: voter_id });
    if (!user) {
      throw new NotFoundException('User Not Found');
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

    project.save();
    return project;
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
        if (mongoose.Types.ObjectId.isValid(fieldValue as string)) {
          deletedProject = await this.projectModel
            .findByIdAndRemove({ _id: fieldValue })
            .populate(this.populations)
            .exec();
        }
        break;
      }
      case 'slug': {
        deletedProject = await this.projectModel
          .findByIdAndRemove({ slug: fieldValue })
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
