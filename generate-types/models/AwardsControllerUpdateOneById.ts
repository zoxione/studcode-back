import type { UpdateAwardDto } from "./UpdateAwardDto";
import type { Award } from "./Award";

/**
 * @description Unauthorized
*/
export type AwardsControllerUpdateOneById401 = any | null;

 /**
 * @description Not Found
*/
export type AwardsControllerUpdateOneById404 = any | null;

 export type AwardsControllerUpdateOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 export type AwardsControllerUpdateOneByIdMutationRequest = UpdateAwardDto;

 /**
 * @description Success
*/
export type AwardsControllerUpdateOneByIdMutationResponse = Award;
export namespace AwardsControllerUpdateOneByIdMutation {
    export type Response = AwardsControllerUpdateOneByIdMutationResponse;
    export type Request = AwardsControllerUpdateOneByIdMutationRequest;
    export type PathParams = AwardsControllerUpdateOneByIdPathParams;
    export type Errors = AwardsControllerUpdateOneById401 | AwardsControllerUpdateOneById404;
}