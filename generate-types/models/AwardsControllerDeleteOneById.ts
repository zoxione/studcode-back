import type { Award } from "./Award";

/**
 * @description Unauthorized
*/
export type AwardsControllerDeleteOneById401 = any | null;

 /**
 * @description Not Found
*/
export type AwardsControllerDeleteOneById404 = any | null;

 export type AwardsControllerDeleteOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 /**
 * @description Success
*/
export type AwardsControllerDeleteOneByIdMutationResponse = Award;
export namespace AwardsControllerDeleteOneByIdMutation {
    export type Response = AwardsControllerDeleteOneByIdMutationResponse;
    export type PathParams = AwardsControllerDeleteOneByIdPathParams;
    export type Errors = AwardsControllerDeleteOneById401 | AwardsControllerDeleteOneById404;
}