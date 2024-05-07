import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Education, EducationSchema } from './schemas/education.schema';
import { EducationsController } from './educations.controller';
import { EducationsService } from './educations.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Education.name, schema: EducationSchema }])],
  controllers: [EducationsController],
  providers: [EducationsService],
  exports: [EducationsService],
})
export class EducationsModule {}
