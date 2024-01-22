import type { Tag } from "./Tag";

/**
 * @description Unauthorized
*/
export type TagsControllerFindOneById401 = any | null;

 /**
 * @description Not Found
*/
export type TagsControllerFindOneById404 = any | null;

 export type TagsControllerFindOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 /**
 * @description Success
*/
export type TagsControllerFindOneByIdQueryResponse = Tag;
export namespace TagsControllerFindOneByIdQuery {
    export type Response = TagsControllerFindOneByIdQueryResponse;
    export type PathParams = TagsControllerFindOneByIdPathParams;
    export type Errors = TagsControllerFindOneById401 | TagsControllerFindOneById404;
}