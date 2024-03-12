import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsModule } from '../tags/tags.module';
import { UploadModule } from '../upload/upload.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Vote, VoteSchema } from '../votes/schemas/vote.schema';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project, ProjectSchema } from './schemas/project.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: Vote.name, schema: VoteSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    TagsModule,
    UploadModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
