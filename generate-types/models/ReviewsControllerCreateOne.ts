import type { CreateReviewDto } from "./CreateReviewDto";
import type { Review } from "./Review";

/**
 * @description Unauthorized
*/
export type ReviewsControllerCreateOne401 = any | null;

 export type ReviewsControllerCreateOneMutationRequest = CreateReviewDto;

 /**
 * @description Success
*/
export type ReviewsControllerCreateOneMutationResponse = Review;
export namespace ReviewsControllerCreateOneMutation {
    export type Response = ReviewsControllerCreateOneMutationResponse;
    export type Request = ReviewsControllerCreateOneMutationRequest;
    export type Errors = ReviewsControllerCreateOne401;
}