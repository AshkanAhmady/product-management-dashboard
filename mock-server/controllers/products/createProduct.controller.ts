import type { CreateProductResponse, Product } from "@contracts/product.contract.js";
import { products } from "@server/data/products.js";
import { randomUUID } from "node:crypto";
import { createProductSchema } from "@server/schemas/product.schema.js";
import type { Request, Response } from "express"

export const createProduct = (
    req: Request, res: Response
) => {

    const result = createProductSchema.safeParse(
        req.body,
    );

    if (!result.success) {
        const response: CreateProductResponse = {
            data: null,
            message:
                result.error.issues[0]?.message ??
                "Invalid product data",
        };

        return res.status(400).json(response);
    }


    const skuExists = products.some(
        (product) =>
            product.sku.toLowerCase() ===
            result.data.sku.toLowerCase(),
    );

    if (skuExists) {
        const response: CreateProductResponse = {
            data: null,
            message: "SKU already exists",
        };

        return res.status(409).json(response);
    }

    const product: Product = {
        id: randomUUID(),
        name: result.data.name,
        sku: result.data.sku,
        category: result.data.category,
        status: result.data.status,
        price: result.data.price,
        weight: result.data.weight,
        stock: result.data.stock,
        createdAt: new Date().toISOString(),
    };

    products.unshift(product);

    const response: CreateProductResponse = {
        data: product,
        message: "Product created successfully",
    };

    return res.status(201).json(response);
}