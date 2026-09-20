import axios from "axios";

import type { ApiErrorResponse } from "@contracts/api.contract";

import { ApiError } from "@/api/apiError";

export const handleApiError = (
    error: unknown,
): ApiError => {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return new ApiError(
            error.response?.data?.message ??
            error.message ??
            "Something went wrong",
            error.response?.status,
        );
    }

    if (error instanceof Error) {
        return new ApiError(error.message);
    }

    return new ApiError("Something went wrong");
};