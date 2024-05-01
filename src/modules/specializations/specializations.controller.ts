import { Body, Controller, Get, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { FindAllFilterSpecializationDto } from './dto/find-all-filter-specialization.dto';
import { Specialization } from './schemas/specialization.schema';
import { SpecializationsService } from './specializations.service';
import { FindAllReturnSpecialization } from './types/find-all-return-specialization';

@ApiBearerAuth()
@ApiTags('specializations')
@Controller({ path: 'specializations', version: '1' })
export class SpecializationsController {
  private readonly fields: (keyof Specialization)[] = ['_id'];

  constructor(private readonly specializationsService: SpecializationsService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/')
  @ApiOperation({ summary: 'Создание новой специализации' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Specialization })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async createOne(@Body() createSpecializationDto: CreateSpecializationDto): Promise<Specialization> {
    return this.specializationsService.createOne(createSpecializationDto);
  }

  @Get('/')
  @ApiOperation({ summary: 'Получение списка специализаций' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Specialization })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(@Query() query: FindAllFilterSpecializationDto): Promise<FindAllReturnSpecialization> {
    return this.specializationsService.findAll(query);
  }

  @Get('/:key')
  @ApiOperation({ summary: 'Получение специализации по _id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Specialization })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  async findOne(@Param('key') key: string): Promise<Specialization> {
    return this.specializationsService.findOne({ fields: this.fields, fieldValue: key });
  }
}
