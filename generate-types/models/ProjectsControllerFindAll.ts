import type { Project } from "./Project";

/**
 * @description Unauthorized
*/
export type ProjectsControllerFindAll401 = any | null;

 /**
 * @description Success
*/
export type ProjectsControllerFindAllQueryResponse = Project;
export namespace ProjectsControllerFindAllQuery {
    export type Response = ProjectsControllerFindAllQueryResponse;
    export type Errors = ProjectsControllerFindAll401;
}