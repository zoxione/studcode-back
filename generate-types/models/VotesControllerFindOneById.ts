import type { Vote } from "./Vote";

/**
 * @description Unauthorized
*/
export type VotesControllerFindOneById401 = any | null;

 /**
 * @description Not Found
*/
export type VotesControllerFindOneById404 = any | null;

 export type VotesControllerFindOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 /**
 * @description Success
*/
export type VotesControllerFindOneByIdQueryResponse = Vote;
export namespace VotesControllerFindOneByIdQuery {
    export type Response = VotesControllerFindOneByIdQueryResponse;
    export type PathParams = VotesControllerFindOneByIdPathParams;
    export type Errors = VotesControllerFindOneById401 | VotesControllerFindOneById404;
}