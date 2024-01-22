import type { User } from "./User";

/**
 * @description Unauthorized
*/
export type UsersControllerFindAll401 = any | null;

 /**
 * @description Success
*/
export type UsersControllerFindAllQueryResponse = User;
export namespace UsersControllerFindAllQuery {
    export type Response = UsersControllerFindAllQueryResponse;
    export type Errors = UsersControllerFindAll401;
}