import {
    useQuery,
    type QueryKey,
    type UseQueryOptions,
    type UseQueryResult,
} from "@tanstack/react-query";

type UseQueryRequestParams<
    TRequestData,
    TQueryFnData,
    TError,
    TData,
    TQueryKey extends QueryKey,
> = {
    queryFn: (
        data: TRequestData | undefined,
        signal: AbortSignal,
    ) => Promise<TQueryFnData>;

    queryKey: TQueryKey;

    data?: TRequestData;

    options?: Omit<
        UseQueryOptions<
            TQueryFnData,
            TError,
            TData,
            TQueryKey
        >,
        "queryKey" | "queryFn"
    >;
};

export function useQueryRequest<
    TRequestData = never,
    TQueryFnData = unknown,
    TError = Error,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>({
    queryFn,
    queryKey,
    data,
    options,
}: UseQueryRequestParams<
    TRequestData,
    TQueryFnData,
    TError,
    TData,
    TQueryKey
>): UseQueryResult<TData, TError> {
    return useQuery<
        TQueryFnData,
        TError,
        TData,
        TQueryKey
    >({
        ...options,
        queryKey,
        queryFn: ({ signal }) =>
            queryFn(data, signal),
    });
}