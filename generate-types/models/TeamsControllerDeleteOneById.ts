import type { Team } from "./Team";

/**
 * @description Unauthorized
*/
export type TeamsControllerDeleteOneById401 = any | null;

 /**
 * @description Not Found
*/
export type TeamsControllerDeleteOneById404 = any | null;

 export type TeamsControllerDeleteOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 /**
 * @description Success
*/
export type TeamsControllerDeleteOneByIdMutationResponse = Team;
export namespace TeamsControllerDeleteOneByIdMutation {
    export type Response = TeamsControllerDeleteOneByIdMutationResponse;
    export type PathParams = TeamsControllerDeleteOneByIdPathParams;
    export type Errors = TeamsControllerDeleteOneById401 | TeamsControllerDeleteOneById404;
}