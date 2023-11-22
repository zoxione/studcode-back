import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ProjectsModule } from './modules/projects/projects.module';
import { TagsModule } from './modules/tags/tags.module';
import { TeamsModule } from './modules/teams/teams.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AwardsModule } from './modules/awards/awards.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env.${configuration().node_env}`, isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(configuration().database),
    ProjectsModule,
    TagsModule,
    UsersModule,
    TeamsModule,
    AwardsModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
  ],
})
export class AppModule {}
