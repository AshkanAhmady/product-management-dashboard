import {
    useMutation,
    type UseMutationOptions,
    type UseMutationResult,
} from "@tanstack/react-query";

type UseMutationRequestParams<
    TData,
    TError,
    TVariables,
    TContext,
> = {
    mutationFn: (variables: TVariables) => Promise<TData>;
    options?: Omit<
        UseMutationOptions<
            TData,
            TError,
            TVariables,
            TContext
        >,
        "mutationFn"
    >;
};

export function useMutationRequest<
    TData,
    TError = Error,
    TVariables = void,
    TContext = unknown,
>({
    mutationFn,
    options,
}: UseMutationRequestParams<
    TData,
    TError,
    TVariables,
    TContext
>): UseMutationResult<
    TData,
    TError,
    TVariables,
    TContext
> {
    return useMutation<
        TData,
        TError,
        TVariables,
        TContext
    >({
        ...options,
        mutationFn,
    });
}