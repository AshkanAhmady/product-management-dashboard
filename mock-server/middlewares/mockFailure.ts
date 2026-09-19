import type { ApiErrorResponse } from "@contracts/api.contract.js";

import type { RequestHandler } from "express";

const MUTATION_METHODS = new Set([
    "POST",
    "PATCH",
    "DELETE",
]);

export const mockFailure: RequestHandler = (
    req,
    res,
    next,
) => {
    const shouldFail =
        MUTATION_METHODS.has(req.method) &&
        req.header("x-mock-failure") === "true";

    if (!shouldFail) {
        return next();
    }

    const response: ApiErrorResponse = {
        data: null,
        message: "Simulated API failure",
    };

    return res.status(500).json(response);
};