import type { Award } from "./Award";

/**
 * @description Unauthorized
*/
export type AwardsControllerFindAll401 = any | null;

 /**
 * @description Success
*/
export type AwardsControllerFindAllQueryResponse = Award;
export namespace AwardsControllerFindAllQuery {
    export type Response = AwardsControllerFindAllQueryResponse;
    export type Errors = AwardsControllerFindAll401;
}