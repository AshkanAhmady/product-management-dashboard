import type { AxiosRequestConfig } from "axios";

import { axiosInstance } from "@/api/http";
import { handleApiError } from "@/api/handleApiError";

interface BaseRequestOptions {
    signal?: AbortSignal;
    headers?: AxiosRequestConfig["headers"];
}

interface GetRequestOptions<P = unknown>
    extends BaseRequestOptions {
    method?: "GET";
    params?: P;
    data?: never;
}

interface MutationRequestOptions<D = unknown>
    extends BaseRequestOptions {
    method: "POST" | "PUT" | "PATCH" | "DELETE";
    data?: D;
    params?: never;
}

type ApiCallerOptions<D = unknown, P = unknown> =
    | GetRequestOptions<P>
    | MutationRequestOptions<D>;

export async function apiCaller<
    T,
    D = unknown,
    P = unknown,
>(
    url: string,
    options: ApiCallerOptions<D, P> = {},
): Promise<T> {
    try {
        const response = await axiosInstance.request<T>({
            url,
            method: options.method ?? "GET",
            data: options.data,
            params: options.method === "GET" || !options.method
                ? options.params
                : undefined,
            signal: options.signal,
            headers: options.headers,
        });

        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
}