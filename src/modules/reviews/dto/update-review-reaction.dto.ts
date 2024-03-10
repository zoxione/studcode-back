import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewReactionDto } from './create-review-reaction.dto';

export class UpdateReviewReactionDto extends PartialType(CreateReviewReactionDto) {}
