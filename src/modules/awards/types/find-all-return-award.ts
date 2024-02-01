import { FindAllReturn } from '../../../common/types/find-all-return';
import { FindAllFilterAwardDto } from '../dto/find-all-filter-award.dto';
import { AwardDocument } from '../schemas/award.schema';

export type FindAllReturnAward = FindAllReturn<FindAllFilterAwardDto, AwardDocument> & {};
