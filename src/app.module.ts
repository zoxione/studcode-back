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
import { VotesModule } from './modules/votes/votes.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { UploadModule } from './modules/upload/upload.module';
import { AppController } from './app.controller';
import { ReactionsModule } from './modules/reactions/reactions.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env.${configuration().node_env}`, isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(configuration().database),
    ProjectsModule,
    TagsModule,
    UsersModule,
    TeamsModule,
    VotesModule,
    ReviewsModule,
    ReactionsModule,
    UploadModule,
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
    MailerModule.forRoot({
      transport: {
        host: configuration().smtp_host,
        port: configuration().smtp_port,
        auth: {
          user: configuration().smtp_user,
          pass: configuration().smtp_password,
        },
      },
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
