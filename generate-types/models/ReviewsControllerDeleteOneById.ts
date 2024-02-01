import type { Review } from "./Review";

/**
 * @description Unauthorized
*/
export type ReviewsControllerDeleteOneById401 = any | null;

 /**
 * @description Not Found
*/
export type ReviewsControllerDeleteOneById404 = any | null;

 export type ReviewsControllerDeleteOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 /**
 * @description Success
*/
export type ReviewsControllerDeleteOneByIdMutationResponse = Review;
export namespace ReviewsControllerDeleteOneByIdMutation {
    export type Response = ReviewsControllerDeleteOneByIdMutationResponse;
    export type PathParams = ReviewsControllerDeleteOneByIdPathParams;
    export type Errors = ReviewsControllerDeleteOneById401 | ReviewsControllerDeleteOneById404;
}