import type { Vote } from "./Vote";

/**
 * @description Unauthorized
*/
export type VotesControllerFindAll401 = any | null;

 /**
 * @description Success
*/
export type VotesControllerFindAllQueryResponse = Vote;
export namespace VotesControllerFindAllQuery {
    export type Response = VotesControllerFindAllQueryResponse;
    export type Errors = VotesControllerFindAll401;
}