import type { Vote } from "./Vote";

/**
 * @description Unauthorized
*/
export type VotesControllerDeleteOneById401 = any | null;

 /**
 * @description Not Found
*/
export type VotesControllerDeleteOneById404 = any | null;

 export type VotesControllerDeleteOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 /**
 * @description Success
*/
export type VotesControllerDeleteOneByIdMutationResponse = Vote;
export namespace VotesControllerDeleteOneByIdMutation {
    export type Response = VotesControllerDeleteOneByIdMutationResponse;
    export type PathParams = VotesControllerDeleteOneByIdPathParams;
    export type Errors = VotesControllerDeleteOneById401 | VotesControllerDeleteOneById404;
}