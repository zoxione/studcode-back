import type { Project } from "./Project";

/**
 * @description Unauthorized
*/
export type ProjectsControllerFindOneById401 = any | null;

 /**
 * @description Not Found
*/
export type ProjectsControllerFindOneById404 = any | null;

 export type ProjectsControllerFindOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 /**
 * @description Success
*/
export type ProjectsControllerFindOneByIdQueryResponse = Project;
export namespace ProjectsControllerFindOneByIdQuery {
    export type Response = ProjectsControllerFindOneByIdQueryResponse;
    export type PathParams = ProjectsControllerFindOneByIdPathParams;
    export type Errors = ProjectsControllerFindOneById401 | ProjectsControllerFindOneById404;
}