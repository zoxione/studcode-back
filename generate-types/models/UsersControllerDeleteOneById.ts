import type { User } from "./User";

/**
 * @description Unauthorized
*/
export type UsersControllerDeleteOneById401 = any | null;

 /**
 * @description Not Found
*/
export type UsersControllerDeleteOneById404 = any | null;

 export type UsersControllerDeleteOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 /**
 * @description Success
*/
export type UsersControllerDeleteOneByIdMutationResponse = User;
export namespace UsersControllerDeleteOneByIdMutation {
    export type Response = UsersControllerDeleteOneByIdMutationResponse;
    export type PathParams = UsersControllerDeleteOneByIdPathParams;
    export type Errors = UsersControllerDeleteOneById401 | UsersControllerDeleteOneById404;
}