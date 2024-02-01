import type { Review } from "./Review";

/**
 * @description Unauthorized
*/
export type ReviewsControllerFindAll401 = any | null;

 /**
 * @description Success
*/
export type ReviewsControllerFindAllQueryResponse = Review;
export namespace ReviewsControllerFindAllQuery {
    export type Response = ReviewsControllerFindAllQueryResponse;
    export type Errors = ReviewsControllerFindAll401;
}