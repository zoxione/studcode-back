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
import { SpecializationsModule } from './modules/specializations/specializations.module';
import { EducationsModule } from './modules/educations/educations.module';
import { TokensModule } from './modules/tokens/tokens.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !configuration().node_env ? '.env' : `.env.${configuration().node_env}`,
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRoot(configuration().database),
    ProjectsModule,
    TagsModule,
    SpecializationsModule,
    EducationsModule,
    UsersModule,
    TeamsModule,
    VotesModule,
    ReviewsModule,
    ReactionsModule,
    UploadModule,
    AuthModule,
    TokensModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: configuration().node_env === 'development' ? '/' : '/swagger',
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
