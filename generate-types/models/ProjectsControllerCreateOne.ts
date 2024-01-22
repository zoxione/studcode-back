import type { CreateProjectDto } from "./CreateProjectDto";
import type { Project } from "./Project";

/**
 * @description Unauthorized
*/
export type ProjectsControllerCreateOne401 = any | null;

 export type ProjectsControllerCreateOneMutationRequest = CreateProjectDto;

 /**
 * @description Success
*/
export type ProjectsControllerCreateOneMutationResponse = Project;
export namespace ProjectsControllerCreateOneMutation {
    export type Response = ProjectsControllerCreateOneMutationResponse;
    export type Request = ProjectsControllerCreateOneMutationRequest;
    export type Errors = ProjectsControllerCreateOne401;
}