import type { CreateAwardDto } from "./CreateAwardDto";
import type { Award } from "./Award";

/**
 * @description Unauthorized
*/
export type AwardsControllerCreateOne401 = any | null;

 export type AwardsControllerCreateOneMutationRequest = CreateAwardDto;

 /**
 * @description Success
*/
export type AwardsControllerCreateOneMutationResponse = Award;
export namespace AwardsControllerCreateOneMutation {
    export type Response = AwardsControllerCreateOneMutationResponse;
    export type Request = AwardsControllerCreateOneMutationRequest;
    export type Errors = AwardsControllerCreateOne401;
}