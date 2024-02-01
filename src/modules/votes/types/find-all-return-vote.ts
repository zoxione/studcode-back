import { FindAllReturn } from '../../../common/types/find-all-return';
import { FindAllFilterVoteDto } from '../dto/find-all-filter-vote.dto';
import { VoteDocument } from '../schemas/vote.schema';

export type FindAllReturnVote = FindAllReturn<FindAllFilterVoteDto, VoteDocument> & {};
