import type { RequestHandler } from "express";

const MOCK_DELAY_MS = 500;

export const mockDelay: RequestHandler = (
    _req,
    _res,
    next,
) => {
    setTimeout(() => {
        next();
    }, MOCK_DELAY_MS);
};