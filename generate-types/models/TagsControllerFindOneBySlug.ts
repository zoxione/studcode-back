import type { Tag } from "./Tag";

/**
 * @description Unauthorized
*/
export type TagsControllerFindOneBySlug401 = any | null;

 /**
 * @description Not Found
*/
export type TagsControllerFindOneBySlug404 = any | null;

 export type TagsControllerFindOneBySlugPathParams = {
    /**
     * @type string
    */
    slug: string;
};

 /**
 * @description Success
*/
export type TagsControllerFindOneBySlugQueryResponse = Tag;
export namespace TagsControllerFindOneBySlugQuery {
    export type Response = TagsControllerFindOneBySlugQueryResponse;
    export type PathParams = TagsControllerFindOneBySlugPathParams;
    export type Errors = TagsControllerFindOneBySlug401 | TagsControllerFindOneBySlug404;
}