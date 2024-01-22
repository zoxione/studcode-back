import type { UpdateTeamDto } from "./UpdateTeamDto";
import type { Team } from "./Team";

/**
 * @description Unauthorized
*/
export type TeamsControllerUpdateOneById401 = any | null;

 /**
 * @description Not Found
*/
export type TeamsControllerUpdateOneById404 = any | null;

 export type TeamsControllerUpdateOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 export type TeamsControllerUpdateOneByIdMutationRequest = UpdateTeamDto;

 /**
 * @description Success
*/
export type TeamsControllerUpdateOneByIdMutationResponse = Team;
export namespace TeamsControllerUpdateOneByIdMutation {
    export type Response = TeamsControllerUpdateOneByIdMutationResponse;
    export type Request = TeamsControllerUpdateOneByIdMutationRequest;
    export type PathParams = TeamsControllerUpdateOneByIdPathParams;
    export type Errors = TeamsControllerUpdateOneById401 | TeamsControllerUpdateOneById404;
}