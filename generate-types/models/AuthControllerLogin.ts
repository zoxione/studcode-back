import type { SignInDto } from "./SignInDto";

export type AuthControllerLogin201 = any | null;

 export type AuthControllerLoginMutationResponse = any | null;

 export type AuthControllerLoginMutationRequest = SignInDto;
export namespace AuthControllerLoginMutation {
    export type Response = AuthControllerLoginMutationResponse;
    export type Request = AuthControllerLoginMutationRequest;
    export type Errors = AuthControllerLogin201;
}