import { FindAllReturn } from '../../../common/types/find-all-return';
import { FindAllFilterSpecializationDto } from '../dto/find-all-filter-specialization.dto';
import { SpecializationDocument } from '../schemas/specialization.schema';

export type FindAllReturnSpecialization = FindAllReturn<FindAllFilterSpecializationDto, SpecializationDocument> & {};
