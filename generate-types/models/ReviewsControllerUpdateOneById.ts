import type { UpdateReviewDto } from "./UpdateReviewDto";
import type { Review } from "./Review";

/**
 * @description Unauthorized
*/
export type ReviewsControllerUpdateOneById401 = any | null;

 /**
 * @description Not Found
*/
export type ReviewsControllerUpdateOneById404 = any | null;

 export type ReviewsControllerUpdateOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 export type ReviewsControllerUpdateOneByIdMutationRequest = UpdateReviewDto;

 /**
 * @description Success
*/
export type ReviewsControllerUpdateOneByIdMutationResponse = Review;
export namespace ReviewsControllerUpdateOneByIdMutation {
    export type Response = ReviewsControllerUpdateOneByIdMutationResponse;
    export type Request = ReviewsControllerUpdateOneByIdMutationRequest;
    export type PathParams = ReviewsControllerUpdateOneByIdPathParams;
    export type Errors = ReviewsControllerUpdateOneById401 | ReviewsControllerUpdateOneById404;
}