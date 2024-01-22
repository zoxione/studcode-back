import type { User } from "./User";

/**
 * @description Unauthorized
*/
export type UsersControllerFindOneById401 = any | null;

 /**
 * @description Not Found
*/
export type UsersControllerFindOneById404 = any | null;

 export type UsersControllerFindOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 /**
 * @description Success
*/
export type UsersControllerFindOneByIdQueryResponse = User;
export namespace UsersControllerFindOneByIdQuery {
    export type Response = UsersControllerFindOneByIdQueryResponse;
    export type PathParams = UsersControllerFindOneByIdPathParams;
    export type Errors = UsersControllerFindOneById401 | UsersControllerFindOneById404;
}