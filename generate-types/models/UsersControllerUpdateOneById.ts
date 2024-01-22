import type { UpdateUserDto } from "./UpdateUserDto";
import type { User } from "./User";

/**
 * @description Unauthorized
*/
export type UsersControllerUpdateOneById401 = any | null;

 /**
 * @description Not Found
*/
export type UsersControllerUpdateOneById404 = any | null;

 export type UsersControllerUpdateOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 export type UsersControllerUpdateOneByIdMutationRequest = UpdateUserDto;

 /**
 * @description Success
*/
export type UsersControllerUpdateOneByIdMutationResponse = User;
export namespace UsersControllerUpdateOneByIdMutation {
    export type Response = UsersControllerUpdateOneByIdMutationResponse;
    export type Request = UsersControllerUpdateOneByIdMutationRequest;
    export type PathParams = UsersControllerUpdateOneByIdPathParams;
    export type Errors = UsersControllerUpdateOneById401 | UsersControllerUpdateOneById404;
}