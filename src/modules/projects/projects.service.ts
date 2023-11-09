import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindAllQueryDto } from '../../common/dto/find-all-query.dto';
import { FindAllReturnDto } from '../../common/dto/find-all-return.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { Project } from './schemas/project.schema';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private readonly projectModel: Model<Project>) {}

  async createOne(createProjectDto: CreateProjectDto): Promise<Project> {
    const createdProject = await this.projectModel.create(createProjectDto);
    return createdProject;
  }

  async findAll({ search = '', page = 0, limit = 20 }: FindAllQueryDto): Promise<FindAllReturnDto> {
    const count = await this.projectModel.countDocuments().exec();
    const searchQuery = search !== '' ? { $text: { $search: search } } : {};
    const foundProjects = await this.projectModel
      .find(searchQuery)
      .skip(page * limit)
      .limit(limit)
      .exec();
    return { stats: { totalCount: count }, data: foundProjects };
  }

  async findOne(field: keyof Project, fieldValue: unknown): Promise<Project> {
    let foundProject: Project | null = null;
    switch (field) {
      case '_id': {
        foundProject = await this.projectModel.findOne({ _id: fieldValue }).exec();
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
        deletedProject = await this.projectModel.findByIdAndRemove({ _id: fieldValue }).exec();
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
