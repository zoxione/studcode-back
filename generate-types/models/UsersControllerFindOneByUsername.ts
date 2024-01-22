import type { User } from "./User";

/**
 * @description Unauthorized
*/
export type UsersControllerFindOneByUsername401 = any | null;

 /**
 * @description Not Found
*/
export type UsersControllerFindOneByUsername404 = any | null;

 export type UsersControllerFindOneByUsernamePathParams = {
    /**
     * @type string
    */
    username: string;
};

 /**
 * @description Success
*/
export type UsersControllerFindOneByUsernameQueryResponse = User;
export namespace UsersControllerFindOneByUsernameQuery {
    export type Response = UsersControllerFindOneByUsernameQueryResponse;
    export type PathParams = UsersControllerFindOneByUsernamePathParams;
    export type Errors = UsersControllerFindOneByUsername401 | UsersControllerFindOneByUsername404;
}