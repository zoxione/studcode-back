import type { CreateVoteDto } from "./CreateVoteDto";
import type { Vote } from "./Vote";

/**
 * @description Unauthorized
*/
export type VotesControllerCreateOne401 = any | null;

 export type VotesControllerCreateOneMutationRequest = CreateVoteDto;

 /**
 * @description Success
*/
export type VotesControllerCreateOneMutationResponse = Vote;
export namespace VotesControllerCreateOneMutation {
    export type Response = VotesControllerCreateOneMutationResponse;
    export type Request = VotesControllerCreateOneMutationRequest;
    export type Errors = VotesControllerCreateOne401;
}