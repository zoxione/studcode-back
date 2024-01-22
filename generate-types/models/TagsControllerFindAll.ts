import type { Tag } from "./Tag";

/**
 * @description Unauthorized
*/
export type TagsControllerFindAll401 = any | null;

 /**
 * @description Success
*/
export type TagsControllerFindAllQueryResponse = Tag;
export namespace TagsControllerFindAllQuery {
    export type Response = TagsControllerFindAllQueryResponse;
    export type Errors = TagsControllerFindAll401;
}