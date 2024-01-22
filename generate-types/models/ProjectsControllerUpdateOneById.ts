import type { UpdateProjectDto } from "./UpdateProjectDto";
import type { Project } from "./Project";

/**
 * @description Unauthorized
*/
export type ProjectsControllerUpdateOneById401 = any | null;

 /**
 * @description Not Found
*/
export type ProjectsControllerUpdateOneById404 = any | null;

 export type ProjectsControllerUpdateOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 export type ProjectsControllerUpdateOneByIdMutationRequest = UpdateProjectDto;

 /**
 * @description Success
*/
export type ProjectsControllerUpdateOneByIdMutationResponse = Project;
export namespace ProjectsControllerUpdateOneByIdMutation {
    export type Response = ProjectsControllerUpdateOneByIdMutationResponse;
    export type Request = ProjectsControllerUpdateOneByIdMutationRequest;
    export type PathParams = ProjectsControllerUpdateOneByIdPathParams;
    export type Errors = ProjectsControllerUpdateOneById401 | ProjectsControllerUpdateOneById404;
}