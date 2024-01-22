import type { Tag } from "./Tag";

/**
 * @description Unauthorized
*/
export type TagsControllerDeleteOneById401 = any | null;

 /**
 * @description Not Found
*/
export type TagsControllerDeleteOneById404 = any | null;

 export type TagsControllerDeleteOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 /**
 * @description Success
*/
export type TagsControllerDeleteOneByIdMutationResponse = Tag;
export namespace TagsControllerDeleteOneByIdMutation {
    export type Response = TagsControllerDeleteOneByIdMutationResponse;
    export type PathParams = TagsControllerDeleteOneByIdPathParams;
    export type Errors = TagsControllerDeleteOneById401 | TagsControllerDeleteOneById404;
}