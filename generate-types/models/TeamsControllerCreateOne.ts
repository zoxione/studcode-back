import type { CreateTeamDto } from "./CreateTeamDto";
import type { Team } from "./Team";

/**
 * @description Unauthorized
*/
export type TeamsControllerCreateOne401 = any | null;

 export type TeamsControllerCreateOneMutationRequest = CreateTeamDto;

 /**
 * @description Success
*/
export type TeamsControllerCreateOneMutationResponse = Team;
export namespace TeamsControllerCreateOneMutation {
    export type Response = TeamsControllerCreateOneMutationResponse;
    export type Request = TeamsControllerCreateOneMutationRequest;
    export type Errors = TeamsControllerCreateOne401;
}