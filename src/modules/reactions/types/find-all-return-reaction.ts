import { FindAllReturn } from '../../../common/types/find-all-return';
import { FindAllFilterReactionDto } from '../dto/find-all-filter-reaction.dto';
import { ReactionDocument } from '../schemas/reaction.schema';

export type FindAllReturnReaction = FindAllReturn<FindAllFilterReactionDto, ReactionDocument> & {};
