import type { UpdateVoteDto } from "./UpdateVoteDto";
import type { Vote } from "./Vote";

/**
 * @description Unauthorized
*/
export type VotesControllerUpdateOneById401 = any | null;

 /**
 * @description Not Found
*/
export type VotesControllerUpdateOneById404 = any | null;

 export type VotesControllerUpdateOneByIdPathParams = {
    /**
     * @type string
    */
    id: string;
};

 export type VotesControllerUpdateOneByIdMutationRequest = UpdateVoteDto;

 /**
 * @description Success
*/
export type VotesControllerUpdateOneByIdMutationResponse = Vote;
export namespace VotesControllerUpdateOneByIdMutation {
    export type Response = VotesControllerUpdateOneByIdMutationResponse;
    export type Request = VotesControllerUpdateOneByIdMutationRequest;
    export type PathParams = VotesControllerUpdateOneByIdPathParams;
    export type Errors = VotesControllerUpdateOneById401 | VotesControllerUpdateOneById404;
}