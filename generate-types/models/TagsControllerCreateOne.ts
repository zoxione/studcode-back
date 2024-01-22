import type { CreateTagDto } from "./CreateTagDto";
import type { Tag } from "./Tag";

/**
 * @description Unauthorized
*/
export type TagsControllerCreateOne401 = any | null;

 export type TagsControllerCreateOneMutationRequest = CreateTagDto;

 /**
 * @description Success
*/
export type TagsControllerCreateOneMutationResponse = Tag;
export namespace TagsControllerCreateOneMutation {
    export type Response = TagsControllerCreateOneMutationResponse;
    export type Request = TagsControllerCreateOneMutationRequest;
    export type Errors = TagsControllerCreateOne401;
}