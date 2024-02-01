import { FindAllReturn } from '../../../common/types/find-all-return';
import { FindAllFilterReviewDto } from '../dto/find-all-filter-review.dto';
import { ReviewDocument } from '../schemas/review.schema';

export type FindAllReturnReview = FindAllReturn<FindAllFilterReviewDto, ReviewDocument> & {};
