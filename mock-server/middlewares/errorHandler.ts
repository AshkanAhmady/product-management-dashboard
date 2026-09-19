import type { ApiErrorResponse } from "@contracts/api.contract.js";

import type {
    ErrorRequestHandler,
    NextFunction,
    Request,
    Response,
} from "express";

export const errorHandler: ErrorRequestHandler = (
    error,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    if (
        error instanceof SyntaxError &&
        "status" in error &&
        error.status === 400
    ) {
        const response: ApiErrorResponse = {
            data: null,
            message: "Invalid JSON body",
        };

        return res.status(400).json(response);
    }

    console.error(error);

    const response: ApiErrorResponse = {
        data: null,
        message: "Internal server error",
    };

    return res.status(500).json(response);
};