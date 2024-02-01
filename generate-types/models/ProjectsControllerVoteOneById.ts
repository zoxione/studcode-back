import type { Project } from "./Project";

/**
 * @description Unauthorized
*/
export type ProjectsControllerVoteOneById401 = any | null;

 /**
 * @description Not Found
*/
export type ProjectsControllerVoteOneById404 = any | null;

 export type ProjectsControllerVoteOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 /**
 * @description Success
*/
export type ProjectsControllerVoteOneByIdMutationResponse = Project;
export namespace ProjectsControllerVoteOneByIdMutation {
    export type Response = ProjectsControllerVoteOneByIdMutationResponse;
    export type PathParams = ProjectsControllerVoteOneByIdPathParams;
    export type Errors = ProjectsControllerVoteOneById401 | ProjectsControllerVoteOneById404;
}