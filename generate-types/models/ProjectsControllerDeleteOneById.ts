import type { Project } from "./Project";

/**
 * @description Unauthorized
*/
export type ProjectsControllerDeleteOneById401 = any | null;

 /**
 * @description Not Found
*/
export type ProjectsControllerDeleteOneById404 = any | null;

 export type ProjectsControllerDeleteOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 /**
 * @description Success
*/
export type ProjectsControllerDeleteOneByIdMutationResponse = Project;
export namespace ProjectsControllerDeleteOneByIdMutation {
    export type Response = ProjectsControllerDeleteOneByIdMutationResponse;
    export type PathParams = ProjectsControllerDeleteOneByIdPathParams;
    export type Errors = ProjectsControllerDeleteOneById401 | ProjectsControllerDeleteOneById404;
}