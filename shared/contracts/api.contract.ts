export interface ApiResponse<T> {
    data: T | null;
    message: string;
}

export type ApiErrorResponse = ApiResponse<null>;