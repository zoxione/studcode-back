import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ProjectsModule } from './modules/projects/projects.module';
import { TagsModule } from './modules/tags/tags.module';
import { TeamsModule } from './modules/teams/teams.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env.${configuration().node_env}`, isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(configuration().database),
    ProjectsModule,
    TagsModule,
    UsersModule,
    TeamsModule,
    AuthModule,
  ],
})
export class AppModule {}
