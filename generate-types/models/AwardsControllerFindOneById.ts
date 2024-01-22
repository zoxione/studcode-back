import type { Award } from "./Award";

/**
 * @description Unauthorized
*/
export type AwardsControllerFindOneById401 = any | null;

 /**
 * @description Not Found
*/
export type AwardsControllerFindOneById404 = any | null;

 export type AwardsControllerFindOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 /**
 * @description Success
*/
export type AwardsControllerFindOneByIdQueryResponse = Award;
export namespace AwardsControllerFindOneByIdQuery {
    export type Response = AwardsControllerFindOneByIdQueryResponse;
    export type PathParams = AwardsControllerFindOneByIdPathParams;
    export type Errors = AwardsControllerFindOneById401 | AwardsControllerFindOneById404;
}