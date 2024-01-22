import type { Team } from "./Team";

/**
 * @description Unauthorized
*/
export type TeamsControllerFindAll401 = any | null;

 /**
 * @description Success
*/
export type TeamsControllerFindAllQueryResponse = Team;
export namespace TeamsControllerFindAllQuery {
    export type Response = TeamsControllerFindAllQueryResponse;
    export type Errors = TeamsControllerFindAll401;
}