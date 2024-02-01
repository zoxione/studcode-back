import { FindAllReturn } from '../../../common/types/find-all-return';
import { FindAllFilterTagDto } from '../dto/find-all-filter-tag.dto';
import { TagDocument } from '../schemas/tag.schema';

export type FindAllReturnTag = FindAllReturn<FindAllFilterTagDto, TagDocument> & {};
