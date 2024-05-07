import { FindAllReturn } from '../../../common/types/find-all-return';
import { FindAllFilterEducationDto } from '../dto/find-all-filter-education.dto';
import { EducationDocument } from '../schemas/education.schema';

export type FindAllReturnEducation = FindAllReturn<FindAllFilterEducationDto, EducationDocument> & {};
