import type { Team } from "./Team";

/**
 * @description Unauthorized
*/
export type TeamsControllerFindOneById401 = any | null;

 /**
 * @description Not Found
*/
export type TeamsControllerFindOneById404 = any | null;

 export type TeamsControllerFindOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 /**
 * @description Success
*/
export type TeamsControllerFindOneByIdQueryResponse = Team;
export namespace TeamsControllerFindOneByIdQuery {
    export type Response = TeamsControllerFindOneByIdQueryResponse;
    export type PathParams = TeamsControllerFindOneByIdPathParams;
    export type Errors = TeamsControllerFindOneById401 | TeamsControllerFindOneById404;
}