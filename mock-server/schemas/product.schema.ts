import { z } from "zod";

import {
    PRODUCT_CATEGORIES,
    PRODUCT_STATUSES,
} from "@contracts/product.contract.js";

const productFieldsSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be at most 100 characters"),

    sku: z
        .string()
        .trim()
        .min(3, "SKU must be at least 3 characters")
        .max(50, "SKU must be at most 50 characters"),

    category: z.enum(PRODUCT_CATEGORIES),

    status: z.enum(PRODUCT_STATUSES),

    price: z
        .number()
        .nonnegative("Price cannot be negative"),

    weight: z
        .number()
        .nonnegative("Weight cannot be negative"),

    stock: z
        .number()
        .int("Stock must be an integer")
        .nonnegative("Stock cannot be negative"),
});

export const createProductSchema =
    productFieldsSchema.refine(
        (product) =>
            product.category !== "Electronics" ||
            product.weight > 0,
        {
            message:
                "Electronics products must have a weight greater than 0",
            path: ["weight"],
        },
    );

export const updateProductSchema =
    productFieldsSchema.partial();