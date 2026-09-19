import type { CheckSkuResponse } from "@contracts/product.contract.js";
import { products } from "@server/data/products.js";
import type { Request, Response } from "express"

export const checkSKU = (
    req: Request,
    res: Response
) => {
    const sku =
        typeof req.query.sku === "string"
            ? req.query.sku.trim()
            : "";

    if (!sku) {
        const response: CheckSkuResponse = {
            data: null,
            message: "SKU is required",
        };

        return res.status(400).json(response);
    }

    const exists = products.some(
        (product) =>
            product.sku.toLowerCase() ===
            sku.toLowerCase(),
    );

    const response: CheckSkuResponse = {
        data: {
            available: !exists,
        },
        message: exists
            ? "SKU already exists"
            : "SKU is available",
    };

    return res.json(response);
}