import type { CreateUserDto } from "./CreateUserDto";

export type AuthControllerRegister201 = any | null;

 export type AuthControllerRegisterMutationResponse = any | null;

 export type AuthControllerRegisterMutationRequest = CreateUserDto;
export namespace AuthControllerRegisterMutation {
    export type Response = AuthControllerRegisterMutationResponse;
    export type Request = AuthControllerRegisterMutationRequest;
    export type Errors = AuthControllerRegister201;
}