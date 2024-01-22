import type { UpdateTagDto } from "./UpdateTagDto";
import type { Tag } from "./Tag";

/**
 * @description Unauthorized
*/
export type TagsControllerUpdateOneById401 = any | null;

 /**
 * @description Not Found
*/
export type TagsControllerUpdateOneById404 = any | null;

 export type TagsControllerUpdateOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 export type TagsControllerUpdateOneByIdMutationRequest = UpdateTagDto;

 /**
 * @description Success
*/
export type TagsControllerUpdateOneByIdMutationResponse = Tag;
export namespace TagsControllerUpdateOneByIdMutation {
    export type Response = TagsControllerUpdateOneByIdMutationResponse;
    export type Request = TagsControllerUpdateOneByIdMutationRequest;
    export type PathParams = TagsControllerUpdateOneByIdPathParams;
    export type Errors = TagsControllerUpdateOneById401 | TagsControllerUpdateOneById404;
}