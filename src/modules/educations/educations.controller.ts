import { Body, Controller, Get, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { CreateEducationDto } from './dto/create-education.dto';
import { FindAllFilterEducationDto } from './dto/find-all-filter-education.dto';
import { Education } from './schemas/education.schema';
import { EducationsService } from './educations.service';
import { FindAllReturnEducation } from './types/find-all-return-education';

@ApiBearerAuth()
@ApiTags('educations')
@Controller({ path: 'educations', version: '1' })
export class EducationsController {
  private readonly fields: (keyof Education)[] = ['_id'];

  constructor(private readonly educationsService: EducationsService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/')
  @ApiOperation({ summary: 'Создание нового образовательного учреждения' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Education })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async createOne(@Body() createEducationDto: CreateEducationDto): Promise<Education> {
    return this.educationsService.createOne(createEducationDto);
  }

  @Get('/')
  @ApiOperation({ summary: 'Получение списка образовательных учреждении' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Education })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(@Query() query: FindAllFilterEducationDto): Promise<FindAllReturnEducation> {
    return this.educationsService.findAll(query);
  }

  @Get('/:key')
  @ApiOperation({ summary: 'Получение образовательного учреждения по _id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Education })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOne(@Param('key') key: string): Promise<Education> {
    return this.educationsService.findOne({ fields: this.fields, fieldValue: key });
  }
}
