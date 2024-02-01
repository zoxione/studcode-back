import type { Review } from "./Review";

/**
 * @description Unauthorized
*/
export type ReviewsControllerFindOneById401 = any | null;

 /**
 * @description Not Found
*/
export type ReviewsControllerFindOneById404 = any | null;

 export type ReviewsControllerFindOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 /**
 * @description Success
*/
export type ReviewsControllerFindOneByIdQueryResponse = Review;
export namespace ReviewsControllerFindOneByIdQuery {
    export type Response = ReviewsControllerFindOneByIdQueryResponse;
    export type PathParams = ReviewsControllerFindOneByIdPathParams;
    export type Errors = ReviewsControllerFindOneById401 | ReviewsControllerFindOneById404;
}